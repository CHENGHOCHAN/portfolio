(()=>{
  const requestedHash=location.hash;
  if(requestedHash){history.replaceState(null,'',location.pathname+location.search);window.scrollTo(0,0)}
  const key=document.body.dataset.project;
  const assets=(window.PROJECT_ASSETS&&window.PROJECT_ASSETS[key])||[];
  const isGiants=key==='giants';
  const chapters={
    characters:{match:item=>item.group.includes('主角角色')||item.group.includes('主角建模'),title:'主角設計',desc:'從角色輪廓與服裝草稿，到確定稿和引擎建模，呈現主角造型如何逐步收斂。',quota:4},
    enemies:{match:item=>isGiants?(item.group.includes('巨人角色')||item.group.includes('巨人建模')):(item.group.includes('BOSS角色')||item.group.includes('BOSS建模')),title:isGiants?'巨人與怪物':'Boss 設計',desc:isGiants?'比較巨人的概念提案、草稿、確定稿與建模成果。':'從概念草稿、角色確定稿到 3D 建模，追蹤 Boss 的視覺演進。',quota:4},
    world:{match:item=>item.major==='場景設計',title:'場景與關卡',desc:'依場景設計稿、平面圖、修改紀錄與建模畫面，閱讀關卡從概念到完成的過程。',quota:6},
    mechanics:{match:item=>item.major==='遊戲機關設計',title:'機關與道具',desc:'展示互動機關、遊戲物件與道具的設計、演示和最終表現。',quota:3},
    ui:{match:item=>item.major==='使用者介面設計',title:'UI 與識別',desc:'包含 LOGO、選單、教學 UI、遊戲內介面與不同版本測試。',quota:3}
  };
  const stageOrder={'確定稿':0,'建模':1,'UI':2,'設計素材':3,'平面圖':4,'草稿':5};
  const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function pickAcrossGroups(items,limit){
    const groups=new Map();
    items.forEach(item=>{if(!groups.has(item.group))groups.set(item.group,[]);groups.get(item.group).push(item)});
    const buckets=[...groups.values()].map(group=>group.sort((a,b)=>(stageOrder[a.stage]??9)-(stageOrder[b.stage]??9)||a.name.localeCompare(b.name,'zh-Hant',{numeric:true})));
    const picked=[];
    let cursor=0;
    while(picked.length<limit&&buckets.some(bucket=>bucket.length)){
      const bucket=buckets[cursor%buckets.length];
      if(bucket.length)picked.push(bucket.shift());
      cursor+=1;
    }
    return picked;
  }

  const chapterAssets={};
  const featuredAssets=new Set();
  Object.entries(chapters).forEach(([id,chapter])=>{
    chapterAssets[id]=assets.filter(chapter.match);
    pickAcrossGroups(chapterAssets[id],chapter.quota).forEach(item=>featuredAssets.add(item.src));
  });
  document.querySelectorAll('[data-asset-count]').forEach(node=>node.textContent=assets.length);

  const firstChapter=document.querySelector('[data-chapter]');
  if(firstChapter){
    const switcher=document.createElement('div');
    switcher.className='archive-view-switch';
    switcher.innerHTML=`<div><span class="section-label pixel">ARCHIVE VIEW</span><strong>選擇閱讀密度</strong><p>先看代表素材，或展開完整製作檔案。</p></div><div class="archive-view-actions"><button class="active" type="button" data-archive-view="featured">精選 ${featuredAssets.size}</button><button type="button" data-archive-view="all">完整素材庫 ${assets.length}</button></div>`;
    firstChapter.parentNode.insertBefore(switcher,firstChapter);
  }

  function renderChapter(id,mode){
    const chapter=chapters[id];
    const section=document.querySelector(`[data-chapter="${id}"]`);
    if(!section)return;
    const allItems=chapterAssets[id];
    const selected=mode==='all'?allItems:allItems.filter(item=>featuredAssets.has(item.src));
    section.querySelector('[data-title]').textContent=chapter.title;
    section.querySelector('[data-desc]').textContent=chapter.desc;
    section.querySelector('[data-count]').textContent=mode==='all'?`${allItems.length} ITEMS`:`${selected.length} 精選 / ${allItems.length}`;
    const target=section.querySelector('[data-content]');
    const groups=new Map();
    selected.forEach(item=>{if(!groups.has(item.group))groups.set(item.group,[]);groups.get(item.group).push(item)});
    const ordered=[...groups.entries()].sort((a,b)=>(stageOrder[a[1][0].stage]??9)-(stageOrder[b[1][0].stage]??9)||a[0].localeCompare(b[0],'zh-Hant',{numeric:true}));
    target.className='archive-groups';
    if(!ordered.length){target.innerHTML='<p class="empty-note">此分類目前沒有素材。</p>';return}
    target.innerHTML=ordered.map(([group,items],index)=>{
      const label=group.replace(items[0].major+' / ','');
      const cards=items.map(item=>`<figure class="asset-card"><button class="asset-button" type="button" data-src="${escapeHtml(item.src)}" data-caption="${escapeHtml(group+' / '+item.name)}"><img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async"></button><figcaption class="asset-caption"><strong>${escapeHtml(item.name)}</strong>${escapeHtml(item.stage)}</figcaption></figure>`).join('');
      return `<details class="archive-group" ${index===0?'open':''}><summary><span class="group-heading"><span class="stage-tag">${escapeHtml(items[0].stage)}</span><h3>${escapeHtml(label)}</h3></span><span class="group-meta">${items.length} 張</span></summary><div class="asset-grid">${cards}</div></details>`;
    }).join('');
  }

  function render(mode){
    Object.keys(chapters).forEach(id=>renderChapter(id,mode));
    document.querySelectorAll('[data-archive-view]').forEach(button=>button.classList.toggle('active',button.dataset.archiveView===mode));
  }
  render('featured');
  document.addEventListener('click',event=>{
    const viewButton=event.target.closest('[data-archive-view]');
    if(viewButton){render(viewButton.dataset.archiveView);return}
    const button=event.target.closest('.asset-button');
    if(!button)return;
    const lightbox=document.querySelector('.archive-lightbox');
    if(!lightbox)return;
    const isSoulLogoDraft=key==='soul'&&button.closest('#ui')&&button.dataset.src.includes('/LOGO/LOGO設計稿');
    const isGiantsLogo=key==='giants'&&button.closest('#ui')&&(button.dataset.src.includes('/LOGO設計稿')||button.dataset.src.includes('/LOGO確定稿'));
    const needsLightBackground=(key==='soul'&&button.closest('#mechanics'))||isSoulLogoDraft||isGiantsLogo;
    lightbox.querySelector('img').src=button.dataset.src;
    lightbox.querySelector('.lightbox-caption').textContent=button.dataset.caption;
    lightbox.classList.toggle('light-background',Boolean(needsLightBackground));
    lightbox.classList.add('open');
  });

  const lightbox=document.querySelector('.archive-lightbox');
  if(lightbox){
    lightbox.addEventListener('click',event=>{if(event.target===lightbox||event.target.closest('.lightbox-close'))lightbox.classList.remove('open')});
    document.addEventListener('keydown',event=>{if(event.key==='Escape')lightbox.classList.remove('open')});
  }
  const sections=[...document.querySelectorAll('.archive-section')];
  const links=[...document.querySelectorAll('.chapter-nav a')];
  const observer=new IntersectionObserver(entries=>{const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;links.forEach(link=>link.classList.toggle('active',link.hash==='#'+visible.target.id))},{rootMargin:'-120px 0px -65% 0px',threshold:[0,.15,.5]});
  sections.forEach(section=>observer.observe(section));
  if(requestedHash)setTimeout(()=>{const target=document.querySelector(requestedHash);if(target)target.scrollIntoView({block:'start'})},120);
})();
