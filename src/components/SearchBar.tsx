"use client";
import Search from './icons/Search'

const SearchBar = () => {
    return (
        <div className="relative">
            <input type="text" placeholder="Rechercher" className="bg-white w-full rounded-md px-2 py-1 text-sm pl-7 placeholder placeholder:text-grayLightDark border border-grayLight focus:outline-none focus:ring-1 focus:ring-yellowLight focus:border-yellow-400" />
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <Search color="#6F6F6F" />
            </div>
        </div>

    )
}

export default SearchBar