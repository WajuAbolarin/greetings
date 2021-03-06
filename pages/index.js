import {useState, useMemo, useEffect, useCallback, useRef} from 'react'
import {Head} from "next/head";

const backGrounds = {
    '#94A3B8': 'gray-100',
    '#3F3F46': 'gray-100',
    '#991B1B': 'red-100',
}
const fonts = [
    {name: 'System', value: "'Amatic SC', cursive'"},
    {name: 'Bangers', value: "'Bangers', cursive"},
    {name: 'Dancing Script', value: "'Dancing Script', cursive"},
    {name: 'Indie Flower', value: "'Indie Flower', cursive"},
    {name: 'Lobster', value: "'Lobster', cursive"},
    {name: 'Montserrat', value: "'Montserrat', sans-serif"},
    {name: 'Playfair Display', value: "Playfair Display', serif"},
    {name: 'Roboto', value: "'Roboto', sans-serif"}
]


export default function IndexPage() {
    const [text] = useState('')
    const [background, setBackground] = useState(() => Object.keys(backGrounds)[0])
    const [fontFamily, setFontFamily] = useState(fonts[0])
    const editorRef = useRef()
    const textColor = useMemo(() => {
        return backGrounds[background]
    }, [background])

    const handleChange = useCallback(e => {
        if (e.target.innerText.length > 208) {
            e.target.innerText = e.target.innerText.slice(0, 208)
        }
    }, [])

    useEffect(() => {
        document.execCommand("defaultParagraphSeparator", false, "br");
        const editor = editorRef.current
        editor.focus()
    }, [])


    return (
        <div style={{height: '100vh', background, overflow: 'hidden'}} tabIndex="-1">
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link
                href="https://fonts.googleapis.com/css2?family=Amatic+SC&family=Bangers&family=Dancing+Script&family=Indie+Flower&family=Lobster&family=Montserrat:ital,wght@0,300;0,400;1,300;1,400&family=Playfair+Display:ital@0;1&family=Roboto:ital,wght@0,100;0,400;1,300;1,400&display=swap"
                rel="stylesheet"/>

            <div className="p-5" tabIndex="0" style={{zIndex: 3, height: '80px'}}>
                <p>
                    <select style={{
                        appearance: 'none',
                        background: 'transparent',
                        border: `1px solid wheat`,
                        borderRadius: '7px',
                        padding: '0.5em',

                    }}  value={background} onChange={e => setBackground(e.target.value)}>
                        {Object.keys(backGrounds).map(bg => <option value={bg} key={bg}>Background :{bg}</option>)}
                    </select>

                    <select style={{
                        display: 'inline-block',
                        marginLeft: '2em',
                        appearance: 'none',
                        background: 'transparent',
                        border: `1px solid wheat`,
                        borderRadius: '7px',
                        padding: '0.5em',
                        fontFamily: fontFamily.value
                    }}  value={background} onChange={e => setFontFamily(fonts[e.target.value])}>
                        {fonts.map((font, index) => <option style={{fontFamily: font.value}} value={index}
                                                            key={font.name}>Font: {font.name}</option>)}
                    </select>
                </p>
            </div>


            <div ref={editorRef}  contentEditable dangerouslySetInnerHTML={{__html: text.slice(0, 208)}}
                 data-placeholder="Type a message to Waju"
                 style={{
                     height: '80%',
                     display: 'grid',
                     placeContent: 'center',
                     textAlign: 'center',
                     gridAutoRows: 'max-content',
                     overflow: 'hidden',
                     wordBreak: 'break-word',
                     lineHeight: 1.6,
                     outline: 'none',
                     fontFamily: fontFamily.value
                 }}
                 className={`text-3xl md:text-7xl w-100 p-10 text-${textColor} message-editor`}
                 onInput={handleChange}
            />
        </div>
    )
}
