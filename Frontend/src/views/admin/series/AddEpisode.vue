<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'



const route = useRoute()
const router = useRouter()
const seriesList = ref([
  { id: 's1', title: 'Breaking Bad' },
  { id: 's2', title: 'Stranger Things' },
  { id: 's3', title: 'The Crown' }
])

const form = reactive({
  seriesId: route.query.seriesId || '',
  season: 1,
  episodeNumber: 1,
  title: '',
  duration: '',
  airDate: '',
  videoUrl: '',
  videoFile: null,
  videoFileName: '',
  isPublished: true
})

onMounted(() => {
  if (!form.seriesId && seriesList.value.length) {
    form.seriesId = seriesList.value[0].id
  }
})

const onVideoFileChange = (e) => {
  const f = e.target.files?.[0] || null
  form.videoFile = f
  form.videoFileName = f ? f.name : ''
  // optional: clear remote URL if file chosen
  if (form.videoFile) form.videoUrl = ''
}

const submit = () => {
  if (!form.seriesId) {
    alert('Vui lòng chọn series.')
    return
  }
  if (!form.title) {
    alert('Vui lòng nhập tên tập.')
    return
  }
  const payload = {
    seriesId: form.seriesId,
    season: Number(form.season),
    episodeNumber: Number(form.episodeNumber),
    title: form.title,
    duration: form.duration ? Number(form.duration) : null,
    airDate: form.airDate || null,
    // for demo prefer file -> use object URL, otherwise use remote URL
    videoUrl: form.videoFile ? URL.createObjectURL(form.videoFile) : (form.videoUrl || ''),
    videoFileName: form.videoFileName || null,
    isPublished: !!form.isPublished
  }
  console.log('Add episode payload (UI-only):', payload)
  alert('Thêm tập  thành công ')
  router.push('/admin/series')
}

const cancel = () => router.back()
</script>

<template>
  <div class="space-y-6 p-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Thêm tập mới</h1>
        <p class="text-slate-400 text-sm">Chọn series có sẵn để thêm tập</p>
      </div>
      <div class="flex gap-2">
        <button @click="cancel" class="px-4 py-2 bg-slate-700 rounded text-white">Hủy</button>
        <button @click="submit" class="px-4 py-2 bg-emerald-600 rounded text-white">Lưu </button>
      </div>
    </div>

    <div class="bg-slate-800/50 border border-slate-700/40 rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-slate-300 mb-1">Series</label>
          <select v-model="form.seriesId" class="w-full bg-slate-700 px-3 py-2 rounded text-white">
            <option value="">-- Chọn series --</option>
            <option v-for="s in seriesList" :key="s.id" :value="s.id">{{ s.title }}</option>
            <option v-if="!seriesList.length" disabled>Không có series</option>
          </select>
        </div>

        <div>
          <label class="block text-sm text-slate-300 mb-1">Mùa</label>
          <input v-model.number="form.season" type="number" min="1" class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
        </div>

        <div>
          <label class="block text-sm text-slate-300 mb-1">Số tập</label>
          <input v-model.number="form.episodeNumber" type="number" min="1" class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
        </div>

        <div>
          <label class="block text-sm text-slate-300 mb-1">Thời lượng (phút)</label>
          <input v-model="form.duration" type="number" min="1" class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm text-slate-300 mb-1">Tên tập</label>
          <input v-model="form.title" type="text" class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
        </div>

        <div>
          <label class="block text-sm text-slate-300 mb-1">Ngày phát sóng</label>
          <input v-model="form.airDate" type="date" class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
        </div>

        <div>
          <label class="block text-sm text-slate-300 mb-1">Video (chọn file hoặc để trống để dùng URL)</label>
          <input type="file" accept="video/*" @change="onVideoFileChange" class="w-full text-sm text-white mb-2" />
          <div v-if="form.videoFileName" class="text-sm text-slate-200">
            File đã chọn: <span class="font-medium">{{ form.videoFileName }}</span>
            <button @click.prevent="() => { form.videoFile = null; form.videoFileName = ''; }" class="ml-3 text-red-400">Bỏ</button>
          </div>
          <div class="mt-2">
            <label class="block text-xs text-slate-400 mb-1">Hoặc nhập Video URL (sẽ dùng nếu không chọn file)</label>
            <input v-model="form.videoUrl" type="url" placeholder="https://..." class="w-full bg-slate-700 px-3 py-2 rounded text-white" />
          </div>
        </div>

        <div class="md:col-span-2 flex items-center gap-4 mt-2">
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="form.isPublished" class="mr-2" />
            <span class="text-slate-300">Đăng ngay</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
.animate-fade-in { animation: fade-in .3s ease-out; }
</style>