<template>
  <div class="p-2 animate-fade-in">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-3xl font-bold text-white">Cài đặt cơ bản</h1>
      </div>

      <div class="flex items-center gap-2">
        <button @click="reset" class="px-3 py-2 bg-slate-700 rounded text-slate-200">Reset</button>
        <button @click="save" :disabled="saving" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded">
          {{ saving ? 'Đang lưu...' : 'Lưu' }}
        </button>
      </div>
    </div>

    <div class="space-y-4">
      <div class="bg-slate-800 p-4 rounded border border-slate-700">
        <label class="text-sm text-slate-300">Tên website</label>
        <input v-model="form.siteName" class="w-full mt-2 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-200" placeholder="Ví dụ: MyCinema" />
      </div>

      <div class="bg-slate-800 p-4 rounded border border-slate-700">
        <label class="text-sm text-slate-300">Tên miền (URL)</label>
        <input v-model="form.siteUrl" class="w-full mt-2 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-200" placeholder="https://example.com" />
      </div>

      <div class="bg-slate-800 p-4 rounded border border-slate-700">
        <label class="text-sm text-slate-300">Logo (URL hoặc upload)</label>
        <input v-model="form.logo" class="w-full mt-2 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-200" placeholder="https://..." />
        <div class="flex items-center gap-3 mt-3">
          <div class="w-24 h-12 bg-slate-700 rounded flex items-center justify-center overflow-hidden border border-slate-600">
            <img v-if="form.logo" :src="form.logo" alt="logo" class="object-contain w-full h-full" />
            <div v-else class="text-slate-400 text-xs px-2">No logo</div>
          </div>
          <div>
            <input @change="handleFile" type="file" accept="image/*" class="text-slate-300" />
          </div>
        </div>
      </div>

      <div class="bg-slate-800 p-4 rounded border border-slate-700">
        <h3 class="text-sm text-slate-300 mb-2">Email liên hệ</h3>
        <div class="space-y-2">
          <div v-for="(e, i) in form.emails" :key="i" class="flex items-center gap-2">
            <input v-model="form.emails[i]" type="email" class="flex-1 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-200" placeholder="contact@example.com" />
            <button @click="removeEmail(i)" class="px-2 py-1 bg-rose-600 rounded text-white">Xóa</button>
          </div>
          <button @click="addEmail" class="px-3 py-2 bg-slate-700 rounded text-slate-200">Thêm email</button>
        </div>
      </div>

      <div class="bg-slate-800 p-4 rounded border border-slate-700">
        <h3 class="text-sm text-slate-300 mb-2">Số điện thoại</h3>
        <div class="space-y-2">
          <div v-for="(p, i) in form.phones" :key="i" class="flex items-center gap-2">
            <input v-model="form.phones[i]" class="flex-1 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-200" placeholder="+84 9xxxxxxx" />
            <button @click="removePhone(i)" class="px-2 py-1 bg-rose-600 rounded text-white">Xóa</button>
          </div>
          <button @click="addPhone" class="px-3 py-2 bg-slate-700 rounded text-slate-200">Thêm số</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const saving = ref(false)
const form = ref({
  siteName: '',
  siteUrl: '',
  logo: '',
  emails: [''],
  phones: ['']
})
let logoFile = null

// load settings from backend
const load = async () => {
  try {
    const res = await api.get('/settings') 
    const s = res?.data?.data || {}
    form.value.siteName = s.siteName || ''
    form.value.siteUrl = s.siteUrl || ''
    form.value.logo = s.logo || ''
    form.value.emails = (s.emails && s.emails.length) ? s.emails.slice() : ['']
    form.value.phones = (s.phones && s.phones.length) ? s.phones.slice() : ['']
  } catch (err) {
    console.error('load settings failed', err)
    form.value.siteName = 'MyCinema'
    form.value.siteUrl = ''
    form.value.logo = ''
    form.value.emails = ['']
    form.value.phones = ['']
  }
}

onMounted(load)

const save = async () => {
  if (!form.value.siteName) return alert('Nhập tên website')
  saving.value = true
  try {
    // if a file was selected, send multipart FormData (logo field)
    if (logoFile) {
      const fd = new FormData()
      fd.append('siteName', form.value.siteName)
      fd.append('siteUrl', form.value.siteUrl)
      fd.append('emails', JSON.stringify(form.value.emails))
      fd.append('phones', JSON.stringify(form.value.phones))
      fd.append('logo', logoFile)
      await api.put('/settings', fd)
    } else {
      // send JSON payload
      const payload = {
        siteName: form.value.siteName,
        siteUrl: form.value.siteUrl,
        logo: form.value.logo, // could be dataURL or existing URL
        emails: form.value.emails,
        phones: form.value.phones
      }
      await api.put('/settings', payload)
    }
    alert('Lưu thành công')
    logoFile = null
    await load()
  } catch (e) {
    console.error('save settings failed', e)
    alert(e?.response?.data?.message || 'Lưu thất bại')
  } finally {
    saving.value = false
  }
}

const reset = () => {
  if (!confirm('Reset về mặc định?')) return
  form.value = { siteName: 'MyCinema', siteUrl: '', logo: '', emails: [''], phones: [''] }
}

// handle file input: preview + store file for upload
const handleFile = (e) => {
  const f = e.target.files?.[0]
  if (!f) return
  const reader = new FileReader()
  reader.onload = () => { form.value.logo = reader.result } // preview
  reader.readAsDataURL(f)
  logoFile = f
}

const addEmail = () => form.value.emails.push('')
const removeEmail = (i) => { form.value.emails.splice(i,1); if (!form.value.emails.length) form.value.emails.push('') }

const addPhone = () => form.value.phones.push('')
const removePhone = (i) => { form.value.phones.splice(i,1); if (!form.value.phones.length) form.value.phones.push('') }
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in .18s ease-out; }
</style>