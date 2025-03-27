import { getContactById, type Contact, updateContact, searchContacts } from "@/api/contacts";
import { useMutation, useQuery } from "@pinia/colada";
import { type MaybeRef, toValue } from "vue";
import { useOptimisticQueries } from "./useOptimisticQueries";


export const CONTACTS_QUERY_KEY = {
    root: () => ['contacts'],
    contact: (id: string | number) => CONTACTS_QUERY_KEY.root().concat(String(id)),
    search: (value: string) => CONTACTS_QUERY_KEY.root().concat('search', value),
};

export const useContactQuery = (contactId: MaybeRef<number>) => useQuery({
    key: () => CONTACTS_QUERY_KEY.contact(toValue(contactId)),
    query: () => getContactById(toValue(contactId)),
    staleTime: 60 * 1000,
})

export const useSearchContactQuery = (searchText: MaybeRef<string>) => useQuery({
    key: () => CONTACTS_QUERY_KEY.contact(toValue(searchText)),
    query: () => searchContacts(toValue(searchText)),
})

export const useContactMutation = () => {
    const { onMutate, onError, onSuccess } = useOptimisticQueries<Contact>(CONTACTS_QUERY_KEY.contact, {
        searchKey: CONTACTS_QUERY_KEY.root().concat('search')
    })
    return useMutation({
        mutation: (contact: Contact) => updateContact(contact),
        onMutate,
        onError,
        onSuccess
    })
}
