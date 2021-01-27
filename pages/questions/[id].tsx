import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import firebase from 'firebase/app'
import Layout from '../../components/Layout'
import { Question } from '../../models/Question'
import { useAuthentication } from '../../hooks/authentication'

type Query = {
  id: string
}

async function onSubmit() {}

export default function QuestionsShow() {
  const router = useRouter()
  const query = router.query as Query
  const { user } = useAuthentication()
  const [question, setQuestion] = useState<Question>(null)
  const [body, setBody] = useState('')
  const [isSending, setIsSending] = useState(false)

  async function loadData() {
    if (query.id === undefined) {
      return
    }

    const questionDoc = await firebase
      .firestore()
      .collection('questions')
      .doc(query.id)
      .get()
    if (!questionDoc.exists) {
      return
    }

    const gotQuestion = questionDoc.data() as Question
    gotQuestion.id = questionDoc.id
    setQuestion(gotQuestion)
  }

  useEffect(() => {
    loadData()
  }, [query.id])

  return (
    <Layout>
      <div className='row justify-content-center'>
        <div className='col-12 col-md-6'>
          {question && (
            <div className='card'>
              <div className='card-body'>{question.body}</div>
            </div>
          )}
          <section className='text-center mt-4'>
            <h2 className='h4'>回答する</h2>

            <form onSubmit={onSubmit}>
              <textarea
                className='form-control'
                placeholder='おげんきですか？'
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              ></textarea>
              <div className='m-3'>
                {isSending ? (
                  <div
                    className='spinner-border text-secondary'
                    role='status'
                  ></div>
                ) : (
                  <button type='submit' className='btn btn-primary'>
                    回答する
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      </div>
    </Layout>
  )
}
