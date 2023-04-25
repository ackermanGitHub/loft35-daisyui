import { useState } from "react"

export const useInput = () => {
    const [active, setActive] = useState(false);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [value, setValue] = useState('');
    const [productId, setProductId] = useState(-1);
    const [type, setType] = useState('');
    const [field, setField] = useState('');

    const inputProps = {
        active, left, top, width, height, value, productId, type, field,
    }

    const editInput = {
        setActive, setLeft, setTop, setWidth, setHeight, setValue, setProductId, setType, setField
    }

    return { inputProps, editInput }
}
