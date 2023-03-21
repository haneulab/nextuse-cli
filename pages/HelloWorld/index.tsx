import dynamic from "next/dynamic"
const Layout = dynamic(() => import('@nextapp/layout'))

const HelloWorld = () => {
	return <>HelloWorld</>
}

HelloWorld.getLayout = (page) => {
	return <Layout>{page}</Layout>
}

export default HelloWorld