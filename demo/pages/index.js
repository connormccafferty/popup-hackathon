import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Popup Content Window Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
        Popup Content Window Demo
        </h1>

        <p className={styles.description}>
          Try out an example dropdown menu built using the Popup Content Window API by clicking the 🔽 button above.
        </p>
      </main>
    </div>
  )
}
