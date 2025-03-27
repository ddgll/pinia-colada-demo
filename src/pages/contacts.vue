<script lang="ts" setup>
import { searchContacts } from '@/api/contacts'
import { useRouteQuery } from '@vueuse/router'
import { refDebounced } from '@vueuse/core'
import { useSearchContactQuery } from "@/queries/useContactsQuery"
import { onErrorCaptured, shallowRef, watch, computed } from 'vue'

const searchText = useRouteQuery('search', '', { mode: 'push' })
const debouncedSearchText = refDebounced(searchText, 200)


const { data: searchResult, asyncStatus, error, refetch } = useSearchContactQuery(debouncedSearchText)

const searching = computed(() => asyncStatus.value === 'loading')
const errored = computed(() => typeof error === Error)
</script>

<template>
  <main class="big-layout">
    <h1 class="mb-12">📇 My Contacts</h1>

    <div class="gap-4 contacts-search md:flex">
      <div>
        <form class="space-x-2" @submit.prevent>
          <input v-model="searchText" :disabled="searching" autofocus type="search" placeholder="Eduardo" />
          <button type="button" @click="refetch" v-if="errored">Retry</button>
          <!-- NOTE: ensure no fetch is done on client while hydrating or this will cause
           a Hydration mismatch -->
          <div v-if="searching">
            <span class="spinner" /><span> Fetching...</span>
          </div>
        </form>

        <ul>
          <li v-for="contact in searchResult?.results" :key="contact.id">
            <RouterLink
              :to="{
                name: '/contacts/[id]',
                params: { id: contact.id },
              }"
            >
              <img
                v-if="contact.photoURL"
                :src="contact.photoURL"
                class="inline-block w-8 rounded-full"
              />
              {{ contact.firstName }} {{ contact.lastName }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <RouterView />
    </div>
  </main>
</template>
