(()=>{
  if(window.__globalSiteFx)return;
  window.__globalSiteFx=true;
  const visibleTextFixes=[
    ['说明','說明'],['检查','檢查'],['参加','參加'],['机關','機關'],
    ['解说','解說'],['判断','判斷'],['两支','兩支'],['继續','繼續']
  ];
  const traditionalPhrases=[
    ['反馈','回饋'],['程序','程式'],['通过','透過'],['制作','製作'],['游戏','遊戲'],['设计','設計'],['学习','學習'],['场景','場景'],['实机','實機'],['企划','企劃'],['美术','美術'],['归档','歸檔'],['互动','互動'],['页面','頁面'],['点击','點擊'],['查看','查看'],['浏览','瀏覽'],['时间轴','時間軸'],['新一代设计展','新一代設計展'],['放视大赏','放視大賞'],['校内展','校內展'],['多媒体','多媒體'],['国立','國立'],['大学','大學'],['展览馆','展覽館'],['展览','展覽'],['试玩','試玩'],['摊位','攤位'],['现场','現場'],['原图','原圖'],['作品库','作品庫'],['个人介绍','個人介紹'],['介绍','介紹'],['教学','教學'],['地图','地圖'],['资源','資源'],['档案','檔案'],['战斗','戰鬥'],['关卡','關卡'],['引导','引導'],['视觉','視覺'],['阶段','階段'],['数值','數值'],['测试','測試'],['专业','專業'],['内容','內容'],['团队','團隊'],['沟通','溝通'],['实际','實際'],['练习','練習'],['观看','觀看'],['最终','最終'],['画面','畫面'],['跳转','跳轉'],['进入','進入'],['整理成','整理成']
  ];
  const traditionalChars={
    '这':'這','从':'從','与':'與','为':'為','个':'個','让':'讓','将':'將','进':'進','场':'場','关':'關','战':'戰','开':'開','设':'設','学':'學','习':'習','项':'項','实':'實','观':'觀','发':'發','画':'畫','图':'圖','过':'過','还':'還','阅':'閱','览':'覽','击':'擊','内':'內','档':'檔','线':'線','师':'師','优':'優','历':'歷','应':'應','总':'總','归':'歸','编':'編','录':'錄','类':'類','体':'體','数':'數','处':'處','当':'當','来':'來','间':'間','万':'萬','术':'術','网':'網','转':'轉','对':'對','并':'並','层':'層','经':'經','领':'領','觉':'覺','现':'現','标':'標','显':'顯','认':'認','备':'備','则':'則','块':'塊','页':'頁','戏':'戲','资':'資','压':'壓','挡':'擋','闪':'閃','国':'國','华':'華','独':'獨','读':'讀','动':'動','听':'聽','选':'選','择':'擇','离':'離','复':'復','该':'該','简':'簡','产':'產','业':'業','众':'眾','绍':'紹','终':'終','续':'續','验':'驗','测':'測','试':'試','号':'號','调':'調','传':'傳','达':'達','创':'創','规':'規','划':'劃','负':'負','责':'責','专':'專','游':'遊','团':'團','队':'隊','导':'導','馈':'饋','连':'連','异':'異','题':'題','阶':'階','馆':'館','届':'屆','于':'於','带':'帶','清':'清'
  };
  const toTraditional=value=>{
    let result=String(value);
    visibleTextFixes.forEach(([from,to])=>{result=result.split(from).join(to)});
    traditionalPhrases.forEach(([from,to])=>{result=result.split(from).join(to)});
    return result.replace(/[\u3400-\u9fff]/g,char=>traditionalChars[char]||char);
  };
  function traditionalize(root){
    if(!root)return;
    if(root.nodeType===Node.TEXT_NODE){const next=toTraditional(root.nodeValue);if(next!==root.nodeValue)root.nodeValue=next;return}
    if(root.nodeType!==Node.ELEMENT_NODE)return;
    if(root.matches('script,style'))return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){if(node.parentElement&&node.parentElement.closest('script,style'))continue;const next=toTraditional(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next}
    root.querySelectorAll('[alt],[title],[aria-label]').forEach(element=>['alt','title','aria-label'].forEach(attr=>{if(!element.hasAttribute(attr))return;const current=element.getAttribute(attr);const next=toTraditional(current);if(next!==current)element.setAttribute(attr,next)}));
  }
  document.title=toTraditional(document.title);
  traditionalize(document.body);
  document.querySelectorAll('.doc-link[href$=".docx"]').forEach(link=>{
    const source=decodeURIComponent(link.getAttribute('href')).replace(/^企劃設計\//,'');
    link.href=`document-viewer.html?doc=${encodeURIComponent(`doc/${source}`)}`;
    const label=link.closest('.analysis-docs')?.querySelector(':scope > span');
    if(label)label.textContent='企劃來源文件 · 點擊進入站內閱讀';
  });
  const languageObserver=new MutationObserver(records=>records.forEach(record=>{if(record.type==='characterData')traditionalize(record.target);record.addedNodes.forEach(traditionalize)}));
  languageObserver.observe(document.body,{subtree:true,childList:true,characterData:true});
  const pages={
    'index.html':{number:'01',name:'HOME'},
    'portfolio.html':{number:'02',name:'WORKS'},
    'about.html':{number:'03',name:'ABOUT'},
    'devlog.html':{number:'04',name:'DEVLOG'},
    'giants.html':{number:'05',name:'GIANTS'},
    'soul.html':{number:'06',name:'SOUL'},
    'contact.html':{number:'07',name:'CONTACT'},
    'document-viewer.html':{number:'DOC',name:'DOCUMENT'}
  };
  const file=decodeURIComponent(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const current=pages[file]||{number:'--',name:'ARCHIVE'};
  if(file==='index.html'){
    const groups=document.querySelector('#about .tool-groups');
    if(groups)groups.innerHTML='<article class="tool-group"><div class="tool-role pixel">FOCUS · 01</div><h3>設計判斷</h3><p>從玩家感受、目標與限制出發，將抽象概念整理成可執行的系統與關卡規則。</p></article><article class="tool-group"><div class="tool-role pixel">FOCUS · 02</div><h3>跨專業溝通</h3><p>用企劃文件、流程與視覺參考，協調程式、美術、建模與聲音製作。</p></article><article class="tool-group"><div class="tool-role pixel">FOCUS · 03</div><h3>迭代驗證</h3><p>透過原型、實機測試與展場回饋，持續調整節奏、引導與玩家理解。</p></article>';
  }
  if(file!=='contact.html')document.querySelectorAll('a[href^="mailto:"]').forEach(link=>{link.href='contact.html'});
  const corner=document.createElement('div');
  corner.className='page-corner';
  corner.innerHTML=`<span class="page-corner-label">CURRENT PAGE<strong>${current.name}</strong></span><span class="page-corner-number">${current.number}</span>`;
  document.body.appendChild(corner);

  const overlay=document.createElement('div');
  overlay.className='page-transition';
  overlay.innerHTML='<div class="page-target"><span class="page-target-copy">NEXT PAGE<strong></strong></span><span class="page-target-number">--</span></div><div class="load-blocks"><i></i><i></i><i></i><i></i><i></i></div>';
  document.body.appendChild(overlay);

  function pageFor(url){const targetFile=decodeURIComponent(url.pathname.split('/').pop()||'index.html').toLowerCase();return pages[targetFile]||{number:'--',name:'ARCHIVE'}}
  function showTransition(targetPage){
    overlay.querySelector('.page-target-number').textContent=targetPage.number;
    overlay.querySelector('.page-target-copy strong').textContent=targetPage.name;
    overlay.classList.add('active');
    document.body.classList.add('page-leaving');
  }
  function burst(event,target){
    const rect=target.getBoundingClientRect();
    const x=event.clientX||rect.left+rect.width/2;
    const y=event.clientY||rect.top+rect.height/2;
    const colors=['','alt','light'];
    for(let i=0;i<12;i++){
      const pixel=document.createElement('i');
      const angle=Math.PI*2*i/12;
      const distance=28+(i%4)*12;
      pixel.className='global-fx-pixel '+colors[i%3];
      pixel.style.left=x+'px';pixel.style.top=y+'px';
      pixel.style.setProperty('--tx',Math.cos(angle)*distance+'px');
      pixel.style.setProperty('--ty',Math.sin(angle)*distance+'px');
      document.body.appendChild(pixel);
      pixel.addEventListener('animationend',()=>pixel.remove());
    }
    const cross=document.createElement('i');
    cross.className='global-fx-cross';cross.style.left=x+'px';cross.style.top=y+'px';
    document.body.appendChild(cross);cross.addEventListener('animationend',()=>cross.remove());
    target.classList.remove('global-fx-hit');void target.offsetWidth;target.classList.add('global-fx-hit');
    setTimeout(()=>target.classList.remove('global-fx-hit'),320);
  }
  let leaving=false;
  window.addEventListener('pageshow',()=>{
    leaving=false;
    overlay.classList.remove('active');
    document.body.classList.remove('page-leaving');
  });
  document.addEventListener('click',event=>{
    const target=event.target.closest('a[href],button,.software,.card,.devlog-card,.contact-link');
    if(!target||target.closest('[data-no-fx]'))return;
    burst(event,target);
    const link=target.closest('a[href]');
    if(!link||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||link.target==='_blank'||link.hasAttribute('download'))return;
    const href=link.getAttribute('href');
    if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:'))return;
    const next=new URL(href,location.href);
    if(next.protocol!==location.protocol||next.host!==location.host)return;
    const nextFile=decodeURIComponent(next.pathname.split('/').pop()||'index.html').toLowerCase();
    if(!pages[nextFile])return;
    if(next.pathname===location.pathname&&next.hash)return;
    event.preventDefault();
    if(leaving)return;
    leaving=true;
    const targetPage=pageFor(next);
    showTransition(targetPage);
    setTimeout(()=>{location.href=next.href},520);
  });
})();
