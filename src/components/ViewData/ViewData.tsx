import { useState } from 'react';
import { ref } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';
import { useDatabase, useDatabaseObjectData, useCallableFunctionResponse, useFunctions } from 'reactfire';
import {
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  TableContainer,
  Button,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalFooter,
  Select,
  Text,
} from '@chakra-ui/react'
import { map, get } from 'lodash';
import CenteredTextBox from '../CenteredTextBox';

interface AccountsAndContactsProps {
  provider: string,
  subdomain: string,
  connectionId: string,
}
export const AccountsAndContacts = ({ provider, subdomain }: AccountsAndContactsProps) => {
  const { status: accountsFunctionStatus } = useCallableFunctionResponse('getSalesforceAccounts', { data: {} });
  const accountsRef = ref(useDatabase(), `${provider}/${subdomain}/accounts`);
  const { status: accountsStatus, data: accounts } = useDatabaseObjectData(accountsRef);

  const { status: contactsFunctionStatus } = useCallableFunctionResponse('getSalesforceContacts', { data: {} });
  const contactsRef = ref(useDatabase(), `${provider}/${subdomain}/contacts`);
  const { status: contactsStatus, data: contacts } = useDatabaseObjectData(contactsRef);

  if (
    accountsStatus === 'loading' || 
    contactsStatus === 'loading' || 
    accountsFunctionStatus === 'loading' ||
    contactsFunctionStatus === 'loading'
    ) {
    return <CenteredTextBox text='Loading...' />;
  }
  return (<>
    <AccountsTable data={accounts as { [key: string]: any }}/>
    <ContactsTable data={contacts as { [key: string]: any }}/>
  </>);
}

interface AccountsTableProps{
  data: { [key: string]: any }
}
const AccountsTable = ({data}: AccountsTableProps) => {
  const rows = map(data, (account, accountId) => {
    // Weird quirk of ReactFire, see https://github.com/FirebaseExtended/reactfire/issues/295.
    if (accountId === 'NO_ID_FIELD') return <></>; return (<Tr key={accountId}>
      <Td>{get(account, 'Name')}</Td>
      <Td>{get(account, 'Industry')}</Td>
      <Td>{get(account, 'AnnualRevenue')}</Td>
      <Td>{get(account, 'Website')}</Td>
    </Tr>);
  })
  return (
    <Box margin='auto' maxWidth='1000px' textAlign='center' paddingTop='50px'>
      <Heading size='md'>Accounts Synced from Salesforce</Heading>
      <TableContainer margin='30px'>
        <Table variant='striped' colorScheme='blackAlpha'>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Industry</Th>
              <Th>Annual Revenue ($)</Th>
              <Th>Website</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>);
}


interface ContactsTableProps {
  data: {[key: string]: any}
}
const ContactsTable = ({ data }: ContactsTableProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ emailRecipient, setEmailRecipient ] = useState('');
  const [ recipientId, setRecipientId ] = useState('');
  const [ emailTemplate, setEmailTemplate ] = useState('Welcome');
  const functions = useFunctions();
  const recordEmailInSalesforce = httpsCallable(functions, 'createNewEmail');

  const handleSendEmail = async () => {
    onClose();
    await recordEmailInSalesforce({
      contactId: recipientId,
      description: `A ${emailTemplate} email was sent with MailMonkey.`,
    }).catch(e => console.error(e));
  }

  const rows = map(data, (contact, contactId) => {
    // Weird quirk of ReactFire, see https://github.com/FirebaseExtended/reactfire/issues/295.
    if (contactId === 'NO_ID_FIELD') return <></>;
    const fName = get(contact, 'FirstName');
    const lName = get(contact, 'LastName');
    const emailAddress = get(contact, 'Email');
    const pronoun = get(contact, 'Pronoun');
    return (<Tr key={contactId}>
      <Td>{fName}</Td>
      <Td>{lName}</Td>
      <Td>{emailAddress}</Td>
      <Td>{pronoun}</Td>
      <Td><Button size='sm' onClick={(event: any) => {
        event.preventDefault();
        setEmailRecipient(`${fName} ${lName} <${emailAddress}>`);
        setRecipientId(contactId);
        onOpen();
      }}>Send Email</Button></Td>
    </Tr>);
  })
  return (
    <Box margin='auto' maxWidth='1000px' textAlign='center' paddingTop='50px'>
      <Heading size='md'>Contacts Synced from Salesforce</Heading>
      <TableContainer margin='30px'>
        <Table variant='striped' colorScheme='blackAlpha'>
          <Thead>
            <Tr>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Email</Th>
              <Th>Pronoun</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send a one-off email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text><b>To:</b> {emailRecipient}</Text>
            <br></br>
            <Text marginBottom='10px'>Select template:</Text>
            <Select onChange={e => {
              setEmailTemplate(e.target.value);
            }}>
              <option value='Welcome'>Welcome</option>
              <option value='User Research'>User Research</option>
              <option value='Checking In'>Checking In</option>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSendEmail}>
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>);
}
