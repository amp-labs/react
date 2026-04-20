import type { ObjectMetadata } from "@generated/api/src";
import { useQuery } from "@tanstack/react-query";
import { useAmpersandProviderProps } from "src/context/AmpersandContextProvider";
import { useAPI } from "src/services/api";

type UseObjectMetadataForConnectionQueryProps = {
  provider: string;
  providerObjectName: string;
  groupRef: string;
  excludeReadOnly?: boolean;
  enabled?: boolean;
};

export const useObjectMetadataForConnectionQuery = ({
  provider,
  providerObjectName,
  groupRef,
  excludeReadOnly,
  enabled = true,
}: UseObjectMetadataForConnectionQueryProps) => {
  const getAPI = useAPI();
  const { projectIdOrName } = useAmpersandProviderProps();

  return useQuery<ObjectMetadata>({
    queryKey: [
      "amp",
      "objectMetadataForConnection",
      projectIdOrName,
      provider,
      providerObjectName,
      groupRef,
      excludeReadOnly,
    ],
    queryFn: async () => {
      if (!projectIdOrName) {
        throw new Error(
          "Project ID or name not found. Please wrap this component inside of AmpersandProvider",
        );
      }
      const api = await getAPI();
      return api.objectsFieldsApi.getObjectMetadataForConnection({
        projectIdOrName,
        provider,
        objectName: providerObjectName,
        groupRef,
        excludeReadOnly,
      });
    },
    enabled:
      enabled && !!projectIdOrName && !!provider && !!providerObjectName && !!groupRef,
    staleTime: Infinity,
    retry: false,
  });
};
