(()=>{
  const params=new URLSearchParams(location.search);
  const key=params.get('doc')||'';
  const documents=window.PORTFOLIO_DOCUMENTS||{};
  const documentData=documents[key];
  const content=document.querySelector('#reader-content');
  const empty=document.querySelector('#reader-empty');
  const index=document.querySelector('#reader-index');
  const download=document.querySelector('#reader-download');
  const back=document.querySelector('#reader-back');

  if(!documentData){
    content.hidden=true;
    empty.hidden=false;
    download.hidden=true;
    return;
  }

  document.title=`${documentData.title}｜企劃文件閱讀器`;
  document.querySelector('#reader-title').textContent=documentData.title;
  document.querySelector('#reader-project').textContent=documentData.project.replace('异','異');
  download.href=documentData.download;
  back.href=documentData.project.includes('巨人')?'giants.html#systems':'soul.html#systems';

  const sections=[];
  let current=null;
  documentData.paragraphs.forEach((paragraph,position)=>{
    const heading=paragraph.match(/^(\d+)\.\s*(.+)$/);
    if(heading){
      current={number:heading[1].padStart(2,'0'),title:heading[2],paragraphs:[]};
      sections.push(current);
      return;
    }
    if(!current){current={number:'00',title:'文件概覽',paragraphs:[]};sections.push(current)}
    current.paragraphs.push(paragraph);
  });

  sections.forEach((section,sectionIndex)=>{
    const id=`chapter-${sectionIndex+1}`;
    const block=document.createElement('section');
    block.className='doc-section';
    block.id=id;
    const title=document.createElement('h2');
    title.dataset.number=`CHAPTER ${section.number}`;
    title.textContent=section.title;
    block.appendChild(title);
    section.paragraphs.forEach(text=>{
      const p=document.createElement('p');
      p.textContent=text.replace(/\*\*/g,'');
      if(/^.{1,18}[：:]$/.test(text.trim()))p.className='doc-label';
      block.appendChild(p);
    });
    content.appendChild(block);

    const item=document.createElement('a');
    item.href=`#${id}`;
    item.innerHTML=`<b>${section.number}</b><span>${section.title}</span>`;
    index.appendChild(item);
  });
})();
