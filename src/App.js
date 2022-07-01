  import logo from './logo.svg';
  import './App.css';
  import {useState} from'react';
  
  function Header(props){
    // 'props'에 props를 props.title로 변경하라는 의미인가? 
    // console.log('props', props, props.title);
    return <header>
      {/* 여기에서 a태그는 html태그가 아닌 유사 html태그 Header를 클릭했을때 onClick은 함수를 호출한다 */}
      <h1><a href="/" onClick={(event)=>{
        // Header를 클릭했을때 Page Reload가 일어나지 않기 위해서는 event객체를 파라미터로 저장한다
        // preventDefault(); = a태그가 동작하는 기본 동작를 방지하는 것이다.
        event.preventDefault();
        //onClick에 함수가 호출됐을때 props로 전달된 onChangeMode함수를 호출
        props.onChangeMode();
      }}>{props.title}</a></h1>
    </header>
  }
  function Nav(props){
    const lis = []

    // props의 topics의 전달된 값을 받아서 각각의 배열을 nav의 돔쪽으로 보내주기위해 for문을 쓴다.
    for(let i=0; i<props.topics.length; i++){
      let t = props.topics[i];
      lis.push(<li key={t.id}>
        <a id={t.id} href={'/read' + t.id} onClick={event=>{
          event.preventDefault();
          // nav의 onChangeMode를 호출 id 값을 얻어오기 위해서 a태그에 id값을 부여하고 함수에서 
          // event객체를 생성하고 target으로 이벤트를 유발시킨 태그를 가르키고 .뒤에 가져올 id를 입력하면 된다.
          props.onChangeMode(Number(event.target.id));
        }}>{t.title}</a>
        </li>)
      // 리액트는 자동으로 생성한 태그들은 추적하기 위해 근거가 필요해 key라고 하는 약속된prop을 부여함으로써 성능을 높이기 위한 약속과 같다.
      // 어떠한 값을 주냐에 따라 추적하여 동작하는 태그를 만든 것 이다.
    }
    return <nav>
      <ol>
        {/* nav에도 목록을 우리가 직접 하드 코딩하기 보단 컴포넌트에 속성 값으로 주면 어떨까
            =>nav도 props를 줘서 자동으로 li를 만들면 얼마나 좋을까
        <li><a href="/read/1">HTML</a></li>
        <li><a href="/read/2">CSS</a></li>
        <li><a href="/read/3">JS</a></li> */}
        {lis}
      </ol>
    </nav>
  }
  function Article(props){
    // 어떻게 위에 똑같이 props가 있는데 여기에는 순차적으로 적용이되지? : props를 순차적으로 한번씩 돌려서 적용한다.
    return <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  }
  //create UI는 꽤 복잡한 구조이기 때문에 별도의 컴포넌트를 만들어 적용시킨다.
  function Create(props){
    return <article>
      <h2>Create</h2>
      {/* form태그란? 사용자가 무언가를 입력한 것을 서버에 전송하는것 / form태그로 입력받을 텍스트 속성 생성  */}
      {/* placeholder ?? : 사용자가 어떠한 정보를 입력해야하는지 알려주는 것 */}
      {/* submit버튼을 클릭했을때 JS코드가 실행되는 가장 좋은 타이밍은 form태그에 onSubmit함수를 사용하는것 */}
      <form onSubmit={event=>{
        event.preventDefault();
        //이 form에서의 title가 body값을 받아오기위한 target(이벤트가 발생한 태그 : 즉 form태그)코드 
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onCreate(title, body);
      }}>
        <p><input type="text" name="title" placeholder="title"/></p>
        {/* 본문은 여러 줄을 표시해야하는데 textarea태그를 사용한다 */}
        <p><textarea name="body" placeholder="body"></textarea></p>
        {/* 제출하는 버튼 */}
        <p><input type="submit" value="Create"></input></p>
      </form>
    </article>
  }
  function Update(props){
    
    const [title, setTitle] = useState(props.title);
    const [body, setBody] = useState(props.body);
    return <article>
    <h2>Update</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      {/* props는 사용자가 지정한 값을 보내놓은 일종의 명령이기 때문에 변경하기 위해선 
      내부자가 사용하는 state로 update컴포넌트를 상태 변경해주어야한다. 
      useState로도 값이 아직 변경되지 않기 때문에 onChange함수(리액트에서는 값이 변경될 때 마다 초기화를 시켜줌)를 써서*/}
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
      // console.log(event.target.value);  onChange로 바뀌는 값을 확인했으니 useState로 다시 바꾸어주어야한다.
        console.log(event.target.value);
        setTitle(event.target.value);
      }}/></p>
      <p><textarea name="body" placeholder="body" value={body} onChange={event=>{
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type="submit" value="Update"></input></p>
    </form>
  </article>
  }
  function App() {
    // 모드의 값이 무엇이냐에 따라 웰컴페이지를 다르게 하고 싶다 = state 함수를 사용하여 훅(리액트에서 제공하는 기본적인 함수)을 만들어야한다.
    // mode라는 지역변수를 상태로 만들어 리턴시켜 리턴된 결과를 _mode로
    // const _mode = useState('Welcome');
    // useState는 배열을 리턴하고 배열에 0번째 원소는 상태의 값을 읽을때 사용되고 1번째 원소는 상태의 값을 변경할때 사용하는 함수
    // const mode = _mode[0];
    // setMode를 통해 1번째 원소인 mode의 값을 바꿀 수 있다.
    // const setMode = _mode[1];
    // ⏬ state 한줄로 / 3줄로 쓰는 것 보다 1줄로 쓰는 코드를 더 자주 쓰기 때문에 익숙해져야할 문법
    const [mode, setMode] = useState('WELCOME');

    const [id, setId] = useState(null);

    // 새로운 토픽 원소가 생성될 때 마다 새로운 id값을 주기 위해서 useState(상태변경 변수)사용 / 맨 마지막 번호가 3이니까 3이후로 생성되기 위해 4를 줌
    const [nextId, setNextId] = useState(4);
    
    // topics는 뒤에서 바꿀 수 없게 하기위해 const를 줘서 코드를 튼튼하게 만들 수 있다.
    // topics에는 여러개의 정보가 있기 때문에 배열로 만들어준다.
    // topics의 정보는 객체화 시켜 보여주기위해 중괄호를 쓴다
    // => JS에 맞게 코드를 짜준다.
    const [topics, setTopics] = useState ([
      {id : 1, title : 'HTML', body : 'html is ...'},
      {id : 2, title : 'CSS', body : 'CSS is ...'},
      {id : 3, title : 'JavaScript', body : 'JavaScript is ...'}
    ]);
    // content에 값을 입력하기 위한 변수 설정
    let content = null;
    // 페이지에 맞는 update Page번호를 주고, 업데이트 버튼은 상세페이지에 들어가야 생성이 되게하기 위해서는
    let contextControl = null;
    if (mode === 'WELCOME'){
      content = <Article title="Welcome" body="Hello, WEB"></Article>
    } else if (mode === 'READ'){
      let title, body = null;
      for(let i = 0; i<topics.length; i++){
        if(topics[i].id === id){
          title = topics[i].title;
          body = topics[i].body;
        }
      }
      content = <Article title={title} body={body}></Article>
      // update로 추가했을때 그 아이디에 내용이 추가되어지기위해 
      contextControl = <>
      <li><a href={'/update/ + id'} onClick={event=>{
        event.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
      <li><input type="button" value="Delete" onClick={()=>{
        const newTopics = []
        for(let i=0; i<topics.length; i++){
          // 만약에 topics의 id와 현재 선택된 id가 다르다면 push를 한다(남긴다) 
          // 이렇게 함으로 delete된 Topics를 제외하곤 나머지 것은 새로운 Topics에 담긴다.
          if(topics[i].id !== id){
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');
      }} /></li>
      </>
    } else if(mode === 'CREATE'){
      // create 버튼을 눌렀을때 생성자가 후속 작업을 할 수 있는 Interface작업
      // create 버튼을 눌렀을때 이 함수가 실행될 겁니다. 라고 사용자에게 알려줄 수 있는 코드
      // submit 버튼을 눌렀을때 title과 body의 값을 사용자의 UI에 표시해주기 위해선 topics변수에 
      // 새로운 원소가 추가되서 UI에 표시해주면 된다. => topics를 상태로 승격시켜주면 된다
      content = <Create onCreate={(_title, _body)=>{
        const newTopic = {id : nextId, title : _title, body : _body}
        // 새로운 객체를 생성하기 위해 {title(객체의 타이틀) : title(파라미터의 이름)}
        
        // create를 눌러도 아무 이슈가 발생하지않는 이유 1. const [] = useState(primitive);면 기존 그대로
        // but : const [] = useState(Object, array);라면 데이터를 복제하여야한다. => newValue = {...value}, [...value]를 통해 컴포넌트를 다시 실행해야한다
        //Deep : seomal.com/map/1/55        
        // 복제본 생성 / 바깥 쪽이 배열이기 때문에[...]
        const newTopics = [...topics]
        // 복제본에 새로운 푸시
        newTopics.push(newTopic);
        // 새로들어온 복제본이 Original의 Topics와 다르다면 그때 렌더링이 시작된다.
        setTopics(newTopics);
        // 잘 추가되었는지 추가했을때 바로 상세페이지로 이동하기 위한 코드
        setMode('READ');
        // id를 지금 우리가 추가한 id값으로
        setId(nextId);
        // 다음에 id를 추가할때를 대비해서 create되면 다음 id로 불러온다.
        setNextId(nextId+1);
      }}></Create>
    } else if(mode === 'UPDATE'){
      //업데이트는 기본적으로 기존의 글의 내용을 가지고 있어야한다.
      let title, body = null;
      for(let i = 0; i<topics.length; i++){
        if(topics[i].id === id){
          title = topics[i].title;
          body = topics[i].body;
        }
      }
      content = <Update title={title} body={body} onUpdate={(title, body)=>{
        const newTopics = [...topics]
        // title과 body를 업데이트 해주면 된다
        const updatedTopic = {id : id, title : title, body : body}
        // topic의 id를 찾기 위한 코드 / 만약 현재 토픽의 id가 기존의 id와 같다면 break
        for(let i=0; i<newTopics.length; i++){
          if(newTopics[i].id === id){
            newTopics[i] = updatedTopic;
            break;
          }
        }
        setTopics(newTopics);
        setMode('READ');
      }}></Update>
    }
    return (
      //기초화면 : div아래에서 화면이 구성된다
      // <div className="App">
      //   Hello React!
      // </div>
      <div>
        {/* header를 클릭하면 함수에 저장된 코드가 호출 */}
        {/* <Header title="WEB" onChangeMode={function(){ 
          function : 간단하게 쓰는 법 ⬇⬇⬇*/}
        <Header title="WEB" onChangeMode={()=>{
          // alert('Header'); / mode의 값을 event가 발생했을때 변경해주는 코드
          setMode ('WELCOME');
        }}></Header>
        {/* "topics"로 한다면 단순한 문자열로 전달되지만 중괄호로 전달을 한다면 데이터 자체가 전달이 된다. */}
        {/* nav에 있는 토픽을 클릭했을때 각각의 id값이 경고창으로 호출한다. */}
        <Nav topics={topics} onChangeMode={(_id)=>{
          // alert(id); /mode의 값을 event가 발생했을때 변경해주는 코드
          setMode ('READ');
          setId(_id);
        }}></Nav>
        {content}
        {/* 링크를 클릭했을때 페이지가 바뀌는 것이 아닌 Mode가 바뀌게 만들고싶다 */}
        <ul>
          <li>
            <a href="/create" onClick={event=>{
            event.preventDefault();
            setMode('CREATE');
          }}>Create</a>
          </li>
          {contextControl}
        </ul>
      </div>
    );
  }

  export default App;
