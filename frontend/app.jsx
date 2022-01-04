const Mails = ({ data }) => {
  
    return(
        <div>
            <h4>Id: {data.id}</h4>
            From: <h4>{data.from}</h4>
            To: <h4>{data.to}</h4>
            Message: <h4>{data.message}</h4>
            RefNum: <p>{data.reference}</p>
            <hr id="refnumber"/>
        </div>
    )
}

const App = () => {

    const [ isShowInput, setIsShowInput ] = React.useState(false);
    const [ showButtonSearch, setShowButtonsearch ] = React.useState(false)
    const [ mailList, setMailList ] = React.useState([])
    const [ showMails, setShowMails ] = React.useState(false)
    const [ mailFromValue, setMailFromValue ] = React.useState([])
    const [ mailToValue, setMailToValue ] = React.useState([])
    const [ mailMsgValue, setMailMsgValue ] = React.useState([])
    const [ mailRefValue, setMailRefValue ] = React.useState([])
    const [ refNumber, setRefNumber ] = React.useState(0)
    const [ refMailList, setRefMailList ] = React.useState([])


    const request = async () =>{
        const response = await axios.get("http://localhost:8080/api/mails")
        setMailList(response.data) 
    };

    const sendMailToBackend = async (e) => {
        e.preventDefault()
        try{
            const mailsAdd = { from: mailFromValue, to: mailToValue, message: mailMsgValue, reference: parseInt(mailRefValue) }
            const response = await axios.post(`http://localhost:8080/api/mails/`, mailsAdd)
            setMailList([...mailList, mailsAdd])
        }catch (error){
            alert("Reference number already exists")
        }
    };

      //If we search for a ref number, the mail with the ref number pops up
    const requestRefNumberMail = async () =>{
             const response = await axios.get("http://localhost:8080/api/mails/" + refNumber)
             setRefMailList(response.data);         
    };
      
    React.useEffect(()=>{
      request()},
      []
    );

    return (
        <div id="app-container">
            <div id="button-container">
                <div className="listMail">
                    <button className="btn" onClick={()=>setShowMails(!showMails)}>List mails</button>
                    <div className="mailContainer">
                        {showMails && mailList.map(mail => <Mails className="mails" key={mail.id} data={mail}/>)}
                    </div>
                </div>
                <div className="newMail">
                    <button className="btn" onClick={()=>setIsShowInput(!isShowInput)}>New mail</button>
                    {isShowInput && <div className="input-container">
                        <input type="text" placeholder="Enter sender Number" value={mailFromValue} onChange={e => setMailFromValue(e.target.value)}/>
                        <input type="text" placeholder="Enter recipient name" value={mailToValue} onChange={e => setMailToValue(e.target.value)}/>
                        <input type="text" placeholder="Enter message" value={mailMsgValue} onChange={e => setMailMsgValue(e.target.value)}/>
                        <input type="number" placeholder="Enter reference number" value={mailRefValue} onChange={e => setMailRefValue(e.target.value)}/>
                        <button id="sendBtn" onClick={sendMailToBackend}>Send</button>
                        </div>
                    }
                </div>
                <div className="Search">
                    <button className="btn" onClick={()=>setShowButtonsearch(!showButtonSearch)}>Search</button>
                    {showButtonSearch && <div>
                        <input type="number" placeholder="Search for reference number" value={refNumber} onChange={e => setRefNumber(e.target.value)}/> 
                        <button onClick={requestRefNumberMail}>Search</button>
                        <div className="mailContainer">
                            {refMailList.map(mail => mail.reference == refNumber ? 
                                <Mails className="mails" key={mail.id} data={mail}/> :
                                 <h3>No mails found!</h3>)}
                        </div>
                    </div>}
                </div>

            </div>
        </div>
    )
}