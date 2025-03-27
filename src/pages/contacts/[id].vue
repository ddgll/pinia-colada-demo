<script lang="ts" setup>
import { useRoute } from 'vue-router/auto'
import ContactCard from '@/components/ContactCard.vue'
import { updateContact as _updateContact, getContactById } from '@/api/contacts'
import type { Contact } from '@/api/contacts'
import { shallowRef, watch, computed } from 'vue'
import { useContactQuery, useContactMutation } from '@/queries/useContactsQuery'

const route = useRoute('/contacts/[id]')

const { data: contact, asyncStatus: queriing } = useContactQuery(() => route.params.id)
const { mutate: updateContact, asyncStatus: mutating } = useContactMutation()
</script>

<template>
  <section class="flex-grow pt-6 md:pt-0">
    <ContactCard
      v-if="queriing !== 'loading' && contact"
      :mutating="mutating === 'loading'"
      :key="contact.id"
      :contact="contact"
      @update:contact="updateContact"
    />
    <div v-else>Loading...</div>
  </section>
</template>
