const fs = require('fs')
const p = 'src/remotion/v6/scenes/Scene06_YouTube.tsx'
const d = String.fromCharCode(100)
let t = fs.readFileSync(p, 'utf8')
const start = t.indexOf('          {/* Sidebar */}')
if (start < 0) {
  console.error('start not found')
  process.exit(1)
}
const closeCol = `          </${d}iv>\n        </${d}iv>`
const endMarker = t.indexOf(closeCol, start)
if (endMarker < 0) {
  console.error('end not found', closeCol)
  process.exit(1)
}
const rep = `          <YouTubeQuizRightRail
            urlComplete={urlComplete}
            showThumbnail={showThumbnail}
            showQuiz={showQuiz}
            showTopics={showTopics}
            showClassroomCards={showClassroomCards}
            showMetrics={showMetrics}
            isGenerating={isGenerating}
            thumbOp={thumbOp}
            thumbScale={thumbScale}
            metricsP={metricsP}
            topicsStart={TOPICS_START}
            metricsStart={METRICS_START}
          />
`
const old = t.slice(start, endMarker)
console.log('removed', old.split('\n').length, 'lines')
t = t.slice(0, start) + rep + t.slice(endMarker)
fs.writeFileSync(p, t)
console.log('ok')
