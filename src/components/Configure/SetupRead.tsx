// import {
//   FormEvent, useState,
// } from 'react';
// import {
//   Box, Button, FormControl, FormLabel, Select, SimpleGrid, Switch, Text,
// } from '@chakra-ui/react';
// import {
//   capitalize,
//   map, merge,
// } from 'lodash';

// import { Integration } from '../../services/api';
// import {
//   postUserConfig,
// } from '../../services/apiService';
// import {
//   DataField,
//   FieldMappingOption,
//   IntegrationConfig,
//   IntegrationSource,
//   ObjectConfigOptions,
//   OptionalDataField,
// } from '../../types/configTypes';
// import {
//   findObjectInIntegrationConfig, getDefaultConfigForSource, redirectTo,
// } from '../../utils';

// const strings = {
//   configureIntro: (
//     appName: string,
//     api: string,
//     subdomain: string,
//   ) => <>Let's integrate {appName} with your {capitalize(api)} instance <b>{subdomain}</b>.</>,
//   reconfigureIntro: (
//     appName: string,
//     api: string,
//     subdomain: string,
//   ) => (
//     <>
//       Let's update {appName}'s integration with your {capitalize(api)} instance <b>{subdomain}</b>.
//     </>
//   ),
//   configureRequiredFields: (
//     appName: string,
//     object: ObjectConfigOptions,
//   ) => {
//     const { name } = object;
//     return <>{appName} will read the following <b>{name.displayName}</b> fields:</>;
//   },
//   reconfigureRequiredFields: (
//     appName: string,
//     object: ObjectConfigOptions,
//   ) => {
//     const { name } = object;
//     return <>{appName} is reading the following <b>{name.displayName}</b> fields:</>;
//   },
// };

// interface SetUpReadProps {
//   integration: string,
//   source: Integration,
//   api: string,
//   subdomain: string,
//   appName: string,
//   userId: string,
//   groupId: string,
//   userConfig?: IntegrationConfig,
//   redirectUrl?: string,
// }
// export function SetUpRead({
//   integration, source, api, subdomain, appName, userId, groupId, userConfig, redirectUrl,
// }: SetUpReadProps) {
//   let config: IntegrationConfig;
//   //  TODO call getHydratedRevision to get config for this integration
//   if (!userConfig) {
//     config = getDefaultConfigForSource(source.objects);
//   } else {
//     config = merge(getDefaultConfigForSource(source.objects), userConfig);
//   }

//   const [integrationConfig, setIntegrationConfig] = useState(config);
//   const [isSuccessfulNoRedirect, setIsSuccessfulNoRedirect] = useState(false);
//   const { objects } = source;

//   const handleSubmit = (event: FormEvent) => {
//     event.preventDefault();
//     postUserConfig(userId, groupId, integration, integrationConfig);

//     if (redirectUrl) {
//       redirectTo(redirectUrl);
//     } else {
//       setIsSuccessfulNoRedirect(true);
//     }
//   };

//   const elems = map(objects, (object: ObjectConfigOptions) => {
//     let mandatoryFields;
//     let optionalFields;
//     let customFieldMapping;

//     if (object.requiredFields) {
//       let configureString = strings.configureRequiredFields(appName, object);
//       if (userConfig) {
//         configureString = strings.reconfigureRequiredFields(appName, object);
//       }

//       mandatoryFields = (
//         <>
//           <Text marginBottom="10px">
//             {configureString}
//           </Text>
//           {/* <FormControl> */}
//             {map(object.requiredFields, (field) => (
//               <Box key={field.fieldName} as={SimpleGrid} columns={{ base: 2, lg: 2 }}>
//                 <FormLabel htmlFor={field.fieldName} margin="0" paddingRight="20px">
//                   {field.displayName}
//                 </FormLabel>
//                 <Switch id={field.fieldName} defaultChecked isDisabled />
//               </Box>
//             ))}
//           </FormControl>
//           <br />
//         </>
//       );
//     }

//     if (object.optionalFields) {
//       // GET USER'S CONFIG SETTINGS, IF THEY EXIST
//       const userObject = findObjectInIntegrationConfig(object, integrationConfig);
//       const userOptionalFieldConfig = userObject?.selectedOptionalFields;

//       optionalFields = (
//         <>
//           <FormControl>
//             <Text color="gray.600" marginBottom="5px">Optional fields:</Text>
//             {map(object.optionalFields, (field: OptionalDataField) => (
//               <Box key={field.fieldName} as={SimpleGrid} columns={{ base: 2, lg: 2 }}>
//                 <FormLabel htmlFor={field.fieldName} margin="0" paddingRight="20px">
//                   { field.displayName }
//                 </FormLabel>
//                 <Switch
//                   id={field.fieldName}
//                   defaultChecked={
//                       userOptionalFieldConfig?.[field.fieldName]
//                       || field.isDefaultSelected
//                     }
//                   onChange={(e) => {
//                     const selectedObject = findObjectInIntegrationConfig(object, integrationConfig);
//                     if (selectedObject) {
//                       selectedObject.selectedOptionalFields[field.fieldName] = e.target.checked;
//                     }

//                     setIntegrationConfig(integrationConfig);
//                   }}
//                 />
//               </Box>
//             ))}
//           </FormControl>
//           <br />
//         </>
//       );
//     }

//     if (object.customFieldMapping) {
//       // GET USER'S CONFIG SETTINGS, IF THEY EXIST
//       const userObject = findObjectInIntegrationConfig(object, integrationConfig);
//       const userSelectedFieldMapping = userObject?.selectedFieldMapping;

//       customFieldMapping = (
//         <>
//           {map(object.customFieldMapping, (mapping: FieldMappingOption) => (
//             <div key={mapping.mapToName}>
//               <Text marginBottom="10px">
//                 Which of your custom fields from <b>{object.name.displayName}</b> should be mapped
//                 to <b>{mapping.mapToDisplayName}</b>?
//               </Text>
//               <Text color="gray.600" marginBottom="10px">{mapping.prompt}</Text>
//               <Select
//                 placeholder="Select custom field"
//                 onChange={(e) => {
//                   const selectedObject = findObjectInIntegrationConfig(object, integrationConfig);

//                   if (selectedObject?.selectedFieldMapping) {
//                     selectedObject.selectedFieldMapping[mapping.mapToName] = e.target.value;
//                   }

//                   setIntegrationConfig(integrationConfig);
//                 }}
//                 defaultValue={userSelectedFieldMapping?.[mapping.mapToName]}
//               >
//                 {map(mapping.choices, (choice: DataField) => (
//                   <option
//                     value={choice.fieldName}
//                     key={choice.fieldName}
//                   >
//                     {choice.displayName}
//                   </option>
//                 ))}
//               </Select>
//             </div>
//           ))}
//           <br />
//         </>
//       );
//     }

//     return (
//       <Box key={object.name.objectName} marginTop="20px" marginBottom="10px">
//         {mandatoryFields}
//         {optionalFields}
//         {customFieldMapping}
//       </Box>
//     );
//   });

//   let IntroString = strings.configureIntro(appName, api, subdomain);

//   if (userConfig) {
//     IntroString = strings.reconfigureIntro(appName, api, subdomain);
//   }

//   if (isSuccessfulNoRedirect) {
//     return (
//       <Box p={8} maxWidth="600px" borderWidth={1} borderRadius={8} boxShadow="lg" textAlign={['left']} margin="auto" marginTop="40px" bgColor="white">
//         <Text>Success!</Text>
//       </Box>
//     );
//   }

//   return (
//     <Box p={8} maxWidth="600px" borderWidth={1} borderRadius={8} boxShadow="lg" textAlign={['left']} margin="auto" marginTop="40px" bgColor="white">
//       <Text marginBottom="20px">
//         {IntroString}
//       </Text>
//       <hr />
//       <form onSubmit={handleSubmit}>
//         {elems}
//         <Button type="submit">Next</Button>
//       </form>
//     </Box>
//   );
// }
