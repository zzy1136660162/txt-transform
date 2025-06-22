<template>
  <q-page class="q-pa-md">
    <div class="q-gutter-md">
      <q-input v-model="inputPath" label="输入文件" readonly>
        <template #append>
          <q-btn flat @click="chooseInput" label="选择" />
        </template>
      </q-input>
      <q-input v-model="outputDir" label="输出目录" readonly>
        <template #append>
          <q-btn flat @click="chooseOutput" label="选择" />
        </template>
      </q-input>
      <q-btn color="primary" :disable="!canTransform" label="开始转换" @click="start" />
    </div>
    <div v-if="previewOriginal.length" class="q-gutter-md q-mt-lg">
      <q-table title="原始值" :rows="previewOriginal" :columns="columns" flat dense  hide-bottom />
      <q-table title="转换后" :rows="previewTransformed" :columns="columns" flat dense  hide-bottom />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Notify } from 'quasar';

export default defineComponent({
  name: 'IndexPage',
  setup () {
    const inputPath = ref('')
    const outputDir = ref('')
    const previewOriginal = ref<Array<{ item83: string; item84: string }>>([])
    const previewTransformed = ref<Array<{ item83: string; item84: string }>>([])

    const columns = [
      { name: 'item83', label: '83', field: 'item83' },
      { name: 'item84', label: '84', field: 'item84' }
    ]

    const canTransform = computed(() => inputPath.value && outputDir.value)

    async function chooseInput () {
      const res = await window.myAPI.selectInputFile()
      if (res) inputPath.value = res
    }

    async function chooseOutput () {
      const res = await window.myAPI.selectOutputDir()
      if (res) outputDir.value = res
    }

    async function start () {
      const result = await window.myAPI.transformFile(inputPath.value, outputDir.value)
      previewOriginal.value = result.original
      previewTransformed.value = result.transformed
      inputPath.value = ''
      outputDir.value = ''
      Notify.create({ message: '转换成功', color: 'positive', timeout: 2000 });
    }

    return { inputPath, outputDir, chooseInput, chooseOutput, start, previewOriginal, previewTransformed, columns, canTransform }
  }
})
</script>
