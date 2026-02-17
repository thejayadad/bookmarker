

type Props = {
    children: React.ReactNode
}

export const PageWrapper = ({children}: Props) => {
    return (
        <div className="hidden h-full lg:block w-92 sticky self-end bottom-6 ">
            <div className="h-full sticky top-6 flex flex-col gapy-4 bg-orange-200">
                {children}
            </div>
        </div>
    )
}