import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Message = {
  role: 'user' | 'advisor'
  text: string
  links?: { label: string; url: string }[]
}

const quickPrompts = [
  'Improve access to clean water',
  'Support small farmers',
  'Reduce youth unemployment',
]

const advisorReplies: Record<string, string> = {
  water: 'For reliable clean-water access, start with a community-led service policy. Pair local water committees with a ring-fenced maintenance fund and simple service-level targets. This keeps ownership close to residents while making delivery measurable.',
  farmer: 'A bundled smallholder support policy is a strong fit: combine extension advice, climate-resilient inputs, and market linkages rather than offering a single subsidy. Pilot it with cooperatives so the model can be tested before scaling.',
  youth: 'Consider an employer-led skills and placement policy. Fund short, verified training tied to real vacancies, then measure success by six-month retention rather than enrollment alone. A small pilot can surface which sectors are ready to hire.',
  digital: 'A rural digital inclusion policy would be appropriate. Combine affordable internet infrastructure, community digital centers, digital-literacy training, and device-access programs. Prioritize underserved villages through public-private partnerships and measure success through availability, affordability, adoption, and regular usage.',
  education: 'For your daughter’s education, prioritize an equitable learning-support policy: keep her regularly enrolled, provide targeted tutoring where she is falling behind, ensure access to books or a device, and create a safe way for families and teachers to track attendance and progress. The best option depends on her age, learning needs, location, and whether the main barrier is cost, distance, safety, or school quality.',
  insurance: 'For two-wheeler insurance, comprehensive insurance is usually the strongest option for a new or valuable bike because it can cover damage to your own vehicle, theft, fire, and third-party liability. At minimum, keep the legally required third-party cover active. Compare the IDV, deductibles, exclusions, claim process, network garages, and add-ons such as zero depreciation or roadside assistance before choosing.',
  default: 'A good policy direction depends on the people affected, the outcome you need, and what can realistically be delivered. Tell me the challenge, who it affects, and your time or budget constraints, and I will compare practical options.',
}

const digitalReferences = [
  { label: 'World Bank: Digital Development', url: 'https://www.worldbank.org/en/topic/digitaldevelopment' },
  { label: 'ITU: Universal and Meaningful Connectivity', url: 'https://www.itu.int/itu-d/sites/projectumc/home/' },
  { label: 'UN: Digital Technologies for Sustainable Development', url: 'https://sdgs.un.org/topics/science-technology-and-innovation' },
]

const educationReferences = [
  { label: 'UNICEF: Education', url: 'https://www.unicef.org/education' },
  { label: 'UNESCO: Education 2030', url: 'https://www.unesco.org/en/education2030-sdg4' },
]

const insuranceReferences = [
  { label: 'IRDAI: Motor Insurance', url: 'https://irdai.gov.in/motor-insurance' },
  { label: 'IRDAI: Policyholder Resources', url: 'https://irdai.gov.in/consumer-information' },
]

const farmerReferences = [
  { label: 'FAO: Plant Health', url: 'https://www.fao.org/plant-health/en/' },
  { label: 'FAO: Integrated Pest Management', url: 'https://www.fao.org/pest-and-pesticide-management/ipm/en/' },
  { label: 'FAO: Climate-Smart Agriculture', url: 'https://www.fao.org/climate-smart-agriculture/en/' },
]

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'advisor',
      text: 'Hello, I’m your policy advisor. Describe a challenge you’re working on and I’ll help you explore practical policy options.',
    },
  ])
  const [activePrompt, setActivePrompt] = useState('')
  const [advisorRole, setAdvisorRole] = useState('')
  const [timeHorizon, setTimeHorizon] = useState('')

  const getReply = (text: string) => {
    const lowerText = text.toLowerCase()
    if (lowerText.includes('water')) return advisorReplies.water
    if (lowerText.includes('farmer') || lowerText.includes('agricultur') || lowerText.includes('crop') || lowerText.includes('pest') || lowerText.includes('plant disease')) return advisorReplies.farmer
    if (lowerText.includes('youth') || lowerText.includes('unemploy')) return advisorReplies.youth
    if (lowerText.includes('digital') || lowerText.includes('internet') || lowerText.includes('connectivity')) return advisorReplies.digital
    if (lowerText.includes('daughter') || lowerText.includes('study') || lowerText.includes('school') || lowerText.includes('education') || lowerText.includes('student')) return advisorReplies.education
    if (lowerText.includes('insurance') || lowerText.includes('bike') || lowerText.includes('byke') || lowerText.includes('motorcycle') || lowerText.includes('scooter') || lowerText.includes('two-wheeler')) return advisorReplies.insurance
    return advisorReplies.default
  }

  const getReferences = (text: string) => {
    const lowerText = text.toLowerCase()
    if (lowerText.includes('digital') || lowerText.includes('internet') || lowerText.includes('connectivity')) return digitalReferences
    if (lowerText.includes('daughter') || lowerText.includes('study') || lowerText.includes('school') || lowerText.includes('education') || lowerText.includes('student')) return educationReferences
    if (lowerText.includes('insurance') || lowerText.includes('bike') || lowerText.includes('byke') || lowerText.includes('motorcycle') || lowerText.includes('scooter') || lowerText.includes('two-wheeler')) return insuranceReferences
    if (lowerText.includes('farmer') || lowerText.includes('agricultur') || lowerText.includes('crop') || lowerText.includes('pest') || lowerText.includes('plant disease')) return farmerReferences
    return undefined
  }

  const getContextNote = () => {
    if (!advisorRole && !timeHorizon) return ''
    const role = advisorRole ? ` for a ${advisorRole.toLowerCase()}` : ''
    const horizon = timeHorizon ? ` over the ${timeHorizon.toLowerCase()} horizon` : ''
    return ` Considering your context${role}${horizon}, begin with a small monitored pilot and review results before scaling.`
  }

  const sendMessage = (event?: FormEvent) => {
    event?.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput) return
    setMessages((currentMessages) => [
      ...currentMessages,
      { role: 'user', text: trimmedInput },
      { role: 'advisor', text: `${getReply(trimmedInput)}${getContextNote()}`, links: getReferences(trimmedInput) },
    ])
    setInput('')
    setActivePrompt('')
  }

  const selectPrompt = (prompt: string) => {
    setInput(prompt)
    setActivePrompt(prompt)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">✳</span><span>Policy Advisor</span></div>
        <div className="topbar-meta"><span className="status-dot" /> Evidence-led guidance <span className="divider" /> <button className="icon-button" aria-label="Open settings">⚙</button></div>
      </header>

      <main className="workspace">
        <section className="chat-panel">
          <div className="eyebrow">POLICY EXPLORER <span>●</span></div>
          <h1>Turn a challenge<br /><em>into a direction.</em></h1>
          <p className="intro">A thoughtful starting point for decisions that affect real lives. Share what you’re trying to change.</p>

          <div className="conversation" aria-live="polite">
            {messages.map((message, index) => (
              <div className={`message-row ${message.role}`} key={`${message.role}-${index}`}>
                {message.role === 'advisor' && <div className="avatar">✳</div>}
                <div className="message-bubble">
                  <div>{message.text}</div>
                  {message.links && <div className="reference-list"><div className="reference-label">FURTHER READING</div>{message.links.map((link) => <a href={link.url} key={link.url} target="_blank" rel="noreferrer">{link.label}<span>↗</span></a>)}</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="prompt-area">
            <div className="prompt-label">START WITH A COMMON NEED</div>
            <div className="prompt-list">
              {quickPrompts.map((prompt) => <button className={`prompt-chip ${activePrompt === prompt ? 'selected' : ''}`} key={prompt} onClick={() => selectPrompt(prompt)}>{prompt}<span>↗</span></button>)}
            </div>
            <form className="composer" onSubmit={sendMessage}>
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Describe the change you want to make..." aria-label="Describe your policy challenge" />
              <button className="send-button" type="submit" aria-label="Send message">↑</button>
            </form>
            <div className="composer-note"><span>↳</span> Be specific about people, place, and desired outcome</div>
          </div>
        </section>

        <aside className="insight-panel">
          <div className="panel-heading"><span>QUICK CONTEXT</span><span className="panel-number">01 / 02</span></div>
          <div className="context-intro"><div className="context-icon">◌</div><h2>Better context,<br /><em>better guidance.</em></h2><p>These details help us surface options that fit your reality.</p></div>
          <div className="context-fields">
            <label>WHO ARE YOU ADVISING?<select value={advisorRole} onChange={(event) => setAdvisorRole(event.target.value)}><option value="">Select a perspective</option><option>Government team</option><option>Community organisation</option><option>Researcher</option></select></label>
            <label>WHAT IS YOUR TIME HORIZON?<select value={timeHorizon} onChange={(event) => setTimeHorizon(event.target.value)}><option value="">Choose a timeframe</option><option>Immediate (0–12 months)</option><option>Medium term (1–3 years)</option><option>Long term (3+ years)</option></select></label>
          </div>
          <div className="insight-footer"><span>◒</span><p>Advice is a starting point, not a substitute for local expertise.</p></div>
        </aside>
      </main>
      <footer><span>POLICY ADVISOR / FIELD NOTE 001</span><span>Designed for better questions.</span></footer>
    </div>
  )
}

export default App
