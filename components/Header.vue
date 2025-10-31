<template>
  <header class="bg-white shadow-sm sticky top-0 z-10">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <i class="fas fa-heart text-red-500 text-2xl"></i>
        <h1 class="text-xl font-bold text-gray-800">Trouve ton ONG</h1>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input type="text" placeholder="Rechercher une ONG..." 
                 class="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-red-500">
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
        <button class="flex items-center space-x-1 text-gray-600 hover:text-red-600">
          <i class="fas fa-user"></i> <span>Connexion</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import {ref} from 'vue'

</script>