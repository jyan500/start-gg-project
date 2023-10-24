import React, {useRef} from "react";

type Props = {
    onSubmit: (val: string) => void
}

const SearchBar = (props: Props) => {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        props.onSubmit(innerRef.current ? innerRef.current.value : "")
    }
    const innerRef = useRef<HTMLInputElement>(null)
    return (
        <div className="flex items-center">
            <form onSubmit={onSubmit}>
                <div className="flex w-full rounded">
                    <input
                        ref={innerRef}
                        type="text"
                        className="block w-full px-4 py-2 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        placeholder="Search..."
                    />
                    <button className="px-4 text-white bg-blue-600 hover:bg-blue-700 border-l rounded ">
                        Search
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SearchBar