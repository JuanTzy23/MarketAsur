let users = JSON.parse(localStorage.getItem("users")||"[]");
let session = JSON.parse(localStorage.getItem("session")||"null");
let history = JSON.parse(localStorage.getItem("history")||"[]");

function show(page){
  document.querySelectorAll(".page").forEach(p => p.style.display="none");
  if(page=="home") document.getElementById("pageHome").style.display="block";
  if(page=="login") document.getElementById("pageLogin").style.display="block";
  if(page=="signup") document.getElementById("pageSignup").style.display="block";
  if(page=="history"){ renderHistory(); document.getElementById("pageHistory").style.display="block"; }
  if(page=="mobil") document.getElementById("formMobil").style.display="block";
  if(page=="kesehatan") document.getElementById("formKesehatan").style.display="block";
  if(page=="jiwa") document.getElementById("formJiwa").style.display="block";
  if(page=="premi") document.getElementById("pagePremi").style.display="block";
  updateNav();
}

function updateNav(){
  document.getElementById("navLogin").style.display=session?"none":"inline";
  document.getElementById("navSignup").style.display=session?"none":"inline";
  document.getElementById("navLogout").style.display=session?"inline":"none";
}

function login(e){
  e.preventDefault();
  let u = users.find(x=>x.email==lemail.value && x.pass==lpass.value);
  if(u){ session={email:u.email,name:u.name}; save(); show("home"); }
  else document.getElementById("msgLogin").innerHTML="<div class='error'>Salah email/password</div>";
}

function signup(e){
  e.preventDefault();
  if(spass.value.length<8) return msgSignup.innerHTML="<div class='error'>Password min 8</div>";
  if(users.some(u=>u.email==semail.value)) return msgSignup.innerHTML="<div class='error'>Email sudah ada</div>";
  users.push({name:sname.value,email:semail.value,pass:spass.value});
  save();
  msgSignup.innerHTML="<div class='success'>Berhasil daftar, silakan login</div>";
}

function logout(){ session=null; save(); show("home"); }

function save(){
  localStorage.setItem("users",JSON.stringify(users));
  localStorage.setItem("session",JSON.stringify(session));
  localStorage.setItem("history",JSON.stringify(history));
  updateNav();
}

function renderHistory(){
  let list=document.getElementById("historyList");
  if(!session){ list.innerHTML="<div class='error'>Login dulu</div>"; return; }
  let myHist=history.filter(h=>h.user==session.email);
  list.innerHTML=myHist.length?myHist.map(h=>`<div class="card">${h.name} - Rp${h.price.toLocaleString()}<br><small>${h.date}</small></div>`).join(""):"<p>Belum ada histori</p>";
}

function showPremi(nama, premi, detail) {
  show("premi");
  document.getElementById("detailPremi").innerHTML = `
    <h3>${nama}</h3>
    ${detail}
    <p><b>Premi Asuransi: Rp ${Math.round(premi).toLocaleString("id-ID")}</b></p>
  `;
  document.getElementById("btnBayar").setAttribute("data-nama", nama);
}

function bayar() {
  let nama = document.getElementById("btnBayar").getAttribute("data-nama");
  alert("Pembayaran untuk " + nama + " berhasil!");
  show("home");
}

document.getElementById("formMobilInput").addEventListener("submit",function(e){
  e.preventDefault();
  let tahun=+document.getElementById("tahun").value;
  let harga=+document.getElementById("harga").value;
  let umurMobil=new Date().getFullYear()-tahun;
  let premi=0;
  if(umurMobil<=3){ premi=0.025*harga; }
  else if(umurMobil<=5){ premi=harga<200000000?0.04*harga:0.03*harga; }
  else { premi=0.05*harga; }

  let detail = `
    Merk: ${merk.value}<br>
    Jenis: ${jenis.value}<br>
    Tahun: ${tahun}<br>
    Umur mobil: ${umurMobil} tahun<br>
    Harga: Rp ${harga.toLocaleString("id-ID")}<br>
  `;

  history.push({name:"Asuransi Mobil",price:Math.round(premi),date:new Date().toLocaleString(),user:session.email});
  save();
  showPremi("Asuransi Mobil", premi, detail);
});

function calc(type){
  let premi=0;
  if(type=="kesehatan"){
    let u=+umur.value, r=+rokok.value, P=2000000, m=(u<=20?0.1:u<=35?0.2:u<=50?0.25:0.4);
    premi=P+(m*P)+(r*0.5*P);
    history.push({name:"Asuransi Kesehatan",price:Math.round(premi),date:new Date().toLocaleString(),user:session.email});
    showPremi("Asuransi Kesehatan", premi, `Umur: ${u}<br>Status: ${r==1?'Merokok':'Tidak Merokok'}`);
  } else if(type=="jiwa"){
    let t=+document.getElementById("t").value; premi=0.002*t;
    history.push({name:"Asuransi Jiwa",price:Math.round(premi),date:new Date().toLocaleString(),user:session.email});
    showPremi("Asuransi Jiwa", premi, `Pertanggungan: Rp${t.toLocaleString()}`);
  }
  save();
}

function previewFoto(event){
  let files = event.target.files;
  let preview = document.getElementById("preview");
  preview.innerHTML = "";
  for(let f of files){
    let img = document.createElement("img");
    img.src = URL.createObjectURL(f);
    img.style.maxWidth = "100px";
    img.style.margin = "5px";
    preview.appendChild(img);
  }
}

updateNav();
show("home");
