// function
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

// class
// import React from 'react'
// import MyContext from '../context'
// import PropTypes from 'prop-types'
// class A extends React.Component {
//     constructor (props) {
//         super(props)
// this.buttonClickHandler = () => {}
//     }
// static contextType = MyContext // 也可以用 A.contextType = MyContext
//     componentDidMount() {...}
//     componentWillUnmount() {...}
//     render() {
    //      this.ctx = this.context
//         return <></>
//     }
// }
// A.contextType = MyContext
// A.propTypes = {
//     k: PropTypes.bool
// }
// A.defaultProps = {
//     k: true
// }
// export default A