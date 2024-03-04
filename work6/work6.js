const RB = ReactBootstrap;
const { Alert, Card, Button, Table } = ReactBootstrap;


class App extends React.Component {

    title = (
        <Alert variant="info">
            <b>Work6 :</b> React with Firebase
        </Alert>
    );
    footer = (
        <div>
            By 643021113-0 Peerapon Phokum <br />
            College of Computing, Khon Kaen University
        </div>
    );
    state = {
        scene: 0,
        students:[],
        stdid:"",
        stdtitle:"",
        stdfname:"",
        stdlname:"",
        stdemail:"",
        stdphone:"",
    }

    edit(std){      
        this.setState({
         stdid    : std.id,
         stdtitle : std.title,
         stdfname : std.fname,
         stdlname : std.lname,
         stdemail : std.email,
         stdphone : std.phone,
        })
     }
     delete(std){
        if(confirm("ต้องการลบข้อมูล")){
           db.collection("students").doc(std.id).delete();
        }
    }

 
    render() {
        return (
            <Card>
              <Card.Header>{this.title}</Card.Header>  
              <Card.Body>
                <Button onClick={()=>this.readData()}>Read Data</Button>
                <Button onClick={()=>this.autoRead()}>Auto Read</Button>
                <div>
                <StudentTable data={this.state.students} app={this}/>  
                </div>
              </Card.Body>
              <Card.Footer>
              <b>เพิ่ม/แก้ไขข้อมูล นักศึกษา :</b><br/>
              <TextInput label="ID" app={this} value="stdid" style={{width:120}}/>  
              <TextInput label="คำนำหน้า" app={this} value="stdtitle" style={{width:100}} />
              <TextInput label="ชื่อ" app={this} value="stdfname" style={{width:120}}/>
              <TextInput label="สกุล" app={this} value="stdlname" style={{width:120}}/>
              <TextInput label="Email" app={this} value="stdemail" style={{width:150}} />        
              <TextInput label="Phone" app={this} value="stdphone" style={{width:120}}/>
              <Button onClick={()=>this.insertData()}>Save</Button>
              </Card.Footer>
              <Card.Footer>{this.footer}</Card.Footer>
            </Card>          
          );    
    }
    readData() {
        db.collection("students").get().then((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            console.log(stdlist);
            this.setState({ students: stdlist });
        });
    }

    autoRead(){
        db.collection("students").onSnapshot((querySnapshot) => {
            var stdlist=[];
            querySnapshot.forEach((doc) => {
                stdlist.push({id:doc.id,... doc.data()});                
            });          
            this.setState({students: stdlist});
        });
    }
    
    insertData(){
        db.collection("students").doc(this.state.stdid).set({
           title : this.state.stdtitle,
           fname : this.state.stdfname,
           lname : this.state.stdlname,
           phone : this.state.stdphone,
           email : this.state.stdemail,
        });
    }


}




const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBlsgPYnmAbih4syipq1Wi6dkd5w64dKOM",
    authDomain: "web2566-peerapon.firebaseapp.com",
    projectId: "web2566-peerapon",
    storageBucket: "web2566-peerapon.appspot.com",
    messagingSenderId: "403616702598",
    appId: "1:403616702598:web:d6499a8a77178385a03107"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.collection("students").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
    });
});

function StudentTable({data, app}){
    return <table className='table'>
     <tr>
         <td>รหัส</td>
         <td>คำนำหน้า</td>
         <td>ชื่อ</td>
         <td>สกุล</td>
         <td>email</td>
         </tr>
         {
           data.map((s)=><tr>
           <td>{s.id}</td>
           <td>{s.title}</td>
           <td>{s.fname}</td>
           <td>{s.lname}</td>
           <td>{s.email}</td>        
           <td><EditButton std={s} app={app}/></td>   
           <td><DeleteButton std={s} app={app}/></td> 
           </tr> )
         }
     </table>
   }
 
   function TextInput({label,app,value,style}){
    return <label className="form-label">
    {label}:    
     <input className="form-control" style={style}
     value={app.state[value]} onChange={(ev)=>{
         var s={};
         s[value]=ev.target.value;
         app.setState(s)}
     }></input>
   </label>;  
  }

  function EditButton({std,app}){
    return <button onClick={()=>app.edit(std)}>แก้ไข</button>
   }
 
   function DeleteButton({std,app}){    
    return <button onClick={()=>app.delete(std)}>ลบ</button>
  }
