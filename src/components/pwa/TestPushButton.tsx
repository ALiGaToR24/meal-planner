"use client";
export default function TestPushButton(){
  async function send(){
    await fetch("/api/push/send",{ method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ title:"Тест уведомления", body:"Это пробный пуш 😉" })
    });
    alert("Отправлено (если подписка есть)");
  }
  return <button className="btn btn-outline-light btn-sm" onClick={send}><i className="bi bi-bell me-1"/>Тест пуша</button>;
}
