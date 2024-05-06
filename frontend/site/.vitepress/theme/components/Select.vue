<script setup lang="ts">
defineProps<{
    name: string;
    label: string;
    placeholder: string;
    options: Array<string>;
}>()
const model = defineModel()
</script>
<template>
    <div>
        <label class="fr-label" :for="name">{{ label }}</label>
        <select
            :id="name"
            class="fr-select"
            :name="name"
            v-model="model"
        >
            <option :value="null">
                {{  placeholder }}
            </option>
            <option v-for="option of options" :value="option">
                {{ option }}
            </option>
        </select>
    </div>
</template>
