import React, {
    // useState,
    useEffect,
    Fragment,
    useReducer
} from "react";
// import First from "./components/First";

export default function ReactComp () {
    let [state, dispatch] = useReducer((state, action) => {
        let res = state
        switch (action.type) {
            case '':
                break
            default:
                break
        }
        return res
    }, {})
    useEffect(() => {}, [])
    return <Fragment>
        <div>
            from ReactComp
        </div>
        {/* <First /> */}
    </Fragment>
}