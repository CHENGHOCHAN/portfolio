(()=>{
  const form=document.querySelector('#contact-form');
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(form);
    const name=String(data.get('name')||'').trim();
    const email=String(data.get('email')||'').trim();
    const subject=String(data.get('subject')||'聯絡邀約');
    const message=String(data.get('message')||'').trim();
    const mailSubject=`【作品集聯絡】${subject}｜${name}`;
    const body=`莊河泉你好：\n\n${message}\n\n聯絡人：${name}\n回覆信箱：${email}`;
    location.href=`mailto:zhuanghequan@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(body)}`;
  });
})();
