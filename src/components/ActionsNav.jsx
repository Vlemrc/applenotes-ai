import Write from './icons/Write'
import Text from './icons/Text'
import CheckList from './icons/CheckList'
import Array from './icons/Array'
import Images from './icons/Images'
import Share from './icons/Share'
import IconHoverContainer from './IconHoverContainer'
import Locker from './icons/Locker'
import Link from './icons/Link'
import SearchBar from './SearchBar'

const ActionsNav = () => {
    return (
        <div className="h-[50px] border-b border-solid border-gray flex flex-row justify-between items-center px-2.5 py-4 w-full">
            <div className="flex flex-row items-center justify-between w-full">
                <IconHoverContainer>
                    <Write color="#6F6F6F" />
                </IconHoverContainer>

                <div className="flex flex-row items-center gap-2">
                    <IconHoverContainer>
                         <Text color="#BFBFBF" />
                    </IconHoverContainer>
                    <IconHoverContainer>
                         <CheckList color="#6F6F6F" />
                    </IconHoverContainer>
                    <IconHoverContainer>
                        <Array color="#6F6F6F" />
                    </IconHoverContainer>
                    <IconHoverContainer>
                         <Images color="#6F6F6F" />
                    </IconHoverContainer>
                </div>
                <div className="flex flex-row items-center gap-x-6">
                    <div className="flex flex-row items-center">
                        <IconHoverContainer>
                            <Link color="#6F6F6F" />
                        </IconHoverContainer>
                        <IconHoverContainer>
                            <Locker color="#6F6F6F" />
                        </IconHoverContainer>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <IconHoverContainer>
                            <Share color="#6F6F6F" />
                        </IconHoverContainer>
                        <SearchBar />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActionsNav