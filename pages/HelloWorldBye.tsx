import dynamic from "next/dynamic"
const Layout = dynamic(() => import('@nextapp/layout'))

const HelloWorldBye = () => {
	return <>HelloWorldBye</>
}

HelloWorldBye.getLayout = (page) => {
	return <Layout>{page}</Layout>
}

export default HelloWorldBye