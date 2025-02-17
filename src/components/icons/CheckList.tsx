const CheckList = ({color}) => {
    return (
        <svg width="19" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 16">
            <path fill={color} d="M3.5,0C1.57,0,0,1.57,0,3.5s1.57,3.5,3.5,3.5,3.5-1.57,3.5-3.5S5.43,0,3.5,0ZM2.85,4.85l-.35-.35-1-1,.35-.35,1,1,2.15-2.15.35.35-2.5,2.5Z"/>
            <rect fill={color} x="9" y="3" width="10" height="1"/>
            <path fill={color} d="M3.5,16c-1.93,0-3.5-1.57-3.5-3.5s1.57-3.5,3.5-3.5,3.5,1.57,3.5,3.5-1.57,3.5-3.5,3.5ZM3.5,10c-1.38,0-2.5,1.12-2.5,2.5s1.12,2.5,2.5,2.5,2.5-1.12,2.5-2.5-1.12-2.5-2.5-2.5Z"/>
            <rect fill={color} x="9" y="12" width="10" height="1"/>
        </svg>
    )
}

export default CheckList