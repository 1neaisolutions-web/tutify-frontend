import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const localesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/locales')
const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en-US.json'), 'utf8'))

const maps = {
  'es-ES': {
    Assessment: 'Evaluación',
    Students: 'Estudiantes',
    Completed: 'Completado',
    'In Progress': 'En progreso',
    Pending: 'Pendiente',
    Formative: 'Formativa',
    Summative: 'Sumativa',
    Due: 'Vence',
    students: 'estudiantes',
    completed: 'completados',
    Document: 'Documento',
    Upload: 'Subir',
    Back: 'Volver',
    Pack: 'Paquete',
    student: 'estudiante',
    Content: 'Contenido',
    Documents: 'Documentos',
  },
  'fr-FR': {
    Assessment: 'Évaluation',
    Students: 'Élèves',
    Completed: 'Terminé',
    'In Progress': 'En cours',
    Pending: 'En attente',
    Formative: 'Formative',
    Summative: 'Sommative',
    Due: 'Échéance',
    students: 'élèves',
    completed: 'terminés',
    Document: 'Document',
    Upload: 'Téléverser',
    Back: 'Retour',
    Pack: 'Pack',
    student: 'élève',
    Content: 'Contenu',
    Documents: 'Documents',
  },
  'pt-BR': {
    Assessment: 'Avaliação',
    Students: 'Estudantes',
    Completed: 'Concluído',
    'In Progress': 'Em andamento',
    Pending: 'Pendente',
    Formative: 'Formativa',
    Summative: 'Somativa',
    Due: 'Prazo',
    students: 'estudantes',
    completed: 'concluídos',
    Document: 'Documento',
    Upload: 'Enviar',
    Back: 'Voltar',
    Pack: 'Pacote',
    student: 'estudante',
    Content: 'Conteúdo',
    Documents: 'Documentos',
  },
  'de-DE': {
    Assessment: 'Bewertung',
    Students: 'Schüler',
    Completed: 'Abgeschlossen',
    'In Progress': 'In Bearbeitung',
    Pending: 'Ausstehend',
    Formative: 'Formativ',
    Summative: 'Summativ',
    Due: 'Fällig',
    students: 'Schüler',
    completed: 'abgeschlossen',
    Document: 'Dokument',
    Upload: 'Hochladen',
    Back: 'Zurück',
    Pack: 'Paket',
    student: 'Schüler',
    Content: 'Inhalt',
    Documents: 'Dokumente',
  },
}

function tr(s, loc) {
  let out = s
  for (const k of Object.keys(maps[loc]).sort((a, b) => b.length - a.length)) {
    out = out.replace(new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g'), maps[loc][k])
  }
  return out
}

function deep(o, loc) {
  if (typeof o === 'string') return tr(o, loc)
  if (Array.isArray(o)) return o.map((x) => deep(x, loc))
  if (o && typeof o === 'object') {
    const r = {}
    for (const [k, v] of Object.entries(o)) r[k] = deep(v, loc)
    return r
  }
  return o
}

function merge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      merge(target[key], value)
    } else {
      target[key] = value
    }
  }
}

function set(obj, parts, val) {
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    cur[parts[i]] = cur[parts[i]] ?? {}
    cur = cur[parts[i]]
  }
  cur[parts[parts.length - 1]] = val
}

for (const loc of ['es-ES', 'fr-FR', 'pt-BR', 'de-DE']) {
  const file = path.join(localesDir, `${loc}.json`)
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  merge(data, {
    assessmentPage: deep(en.assessmentPage, loc),
    documentUploadPage: deep(en.documentUploadPage, loc),
  })
  set(
    data,
    ['literacyLabCoach', 'pasteStudentWritingSample'],
    tr(en.literacyLabCoach.pasteStudentWritingSample, loc),
  )
  set(
    data,
    ['instantFeedbackModule', 'feedbackPromptPlaceholder'],
    tr(en.instantFeedbackModule.feedbackPromptPlaceholder, loc),
  )
  set(
    data,
    ['tieredInstructionModule', 'assessmentAcrossTiersPlaceholder'],
    tr(en.tieredInstructionModule.assessmentAcrossTiersPlaceholder, loc),
  )
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8')
  console.log('patched', loc)
}
