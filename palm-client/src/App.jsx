import {useRef, useState} from 'react'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

marked.use({
  gfm: true,
})

function App() {
  const [ serverData, setServerData ] = useState("")
  const [ userPrompt, setUserPrompt ] = useState("")
  const inputRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      inputRef.current.blur()
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (userPrompt !== "") {
      fetch('/api', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({'prompt': userPrompt})
      })
        .then(res => res.json())
        .then(data => {
          const html= DOMPurify.sanitize(marked(data))
          setServerData({...data, html})
          inputRef.current.focus()
          setUserPrompt("")
        })
    }
  }

  return (
    <main style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
      <h1 style={{padding: '10px', marginBottom: '0'}}>My Prompter</h1>
      <div style={{margin: '0', flexGrow: '1', overflowY: 'scroll'}}>
        <div style={{width: '100%', height: '100%'}}>
          {
            (serverData === "") ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                  <p style={{margin: '0'}}>Type in a prompt and hit Go to get started.</p>
                </div>
              ) :
              <article style={{margin: '0'}} dangerouslySetInnerHTML={{__html: serverData.html}}/>
          }
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'end', backgroundColor: '#222', padding: '10px'}}>
        <textarea
          style={{margin: '0', flexGrow: '1', overflowY: 'hidden'}}
          placeholder='Type in Prompt...'
          onChange={e => setUserPrompt(e.target.value)}
          onKeyDown={ handleKeyDown }
          ref={ inputRef }
          value={ userPrompt }
        />
        <button
          style={{margin: '0', flex: '1', marginLeft: '10px'}}
          onClick={handleSubmit}
        >
          Go
        </button>
      </div>
    </main>
  )
}

export default App