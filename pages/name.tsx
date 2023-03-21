import dynamic from "next/dynamic"
const Layout = dynamic(() => import('@nextapp/layout'))

const name = () => {
	return <>name</>
}

name.getLayout = (page) => {
	return <Layout>{page}</Layout>
}

export default name