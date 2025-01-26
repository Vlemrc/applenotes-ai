import Write from './icons/Write'
import Text from './icons/Text'
import CheckList from './icons/CheckList'
import Array from './icons/Array'
import Images from './icons/Images'

const ActionsNav = () => {
    return (
        <div className="h-[50px] border-b border-solid border-gray flex flex-row justify-between items-center px-2.5 py-4 w-full">
            <div className="flex flex-row items-center">
                <Write color="#6F6F6F" />
                <div className="flex flex-row items-center">
                    <Text color="grayLightDark" />
                    <CheckList color="#6F6F6F" />
                    <Array color="#6F6F6F" />
                    <Images color="#6F6F6F" />
                </div>
            </div>
        </div>
    )
}

export default ActionsNav