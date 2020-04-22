const url ="http://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigos/26/produits";
let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json",);

/* Lister le contenu du frigo */
let contenuFrigo = document.getElementById("contenu");
contenuFrigo.addEventListener("click", listerFrigo);
let ouveture = 0;

function listerFrigo(){
  let fetchOptions = {method: 'GET'};
  fetch(url, fetchOptions)
    .then( (response) => {
      return response.json()
    })
    .then( (dataJSON) => {
      let listeFinale = document.getElementById("contenuFrigo");
      let res ="<table><tr><th>Produit</th><th>&nbsp; Quantité &nbsp;</th></tr>";
      for (let p of dataJSON) {
        res = res + "<tr><td>" + p.nom + "</td><td>" + p.qte + "</td></tr>";
      }
      listeFinale.innerHTML = res + "</table>";
      ouveture = 1;
    })
    .catch( (error) => {
      console.log(error)
    })
}

/*fermer le frigo*/
document.getElementById("contenuF").addEventListener("click", fermerFrigo);

function fermerFrigo(event){
    document.getElementById("contenuFrigo").innerHTML = "";
}

/* Ajouter un nouveau produit au frigo */
let ajoutProduit = document.getElementById("ajouter");
ajoutProduit.addEventListener("submit", ajouterProduit);


function ajouterProduit(event){
  event.preventDefault();
  let produitNom = document.getElementById("produitAjout").value;
  let produitQte = document.getElementById("quantiteAjout").value;
  let produit = {"nom": produitNom, "qte":produitQte};
  const fetchOptions = {
   method: 'POST',
   headers: myHeaders,
   body: JSON.stringify(produit)
  }
  fetch(url, fetchOptions)
    .then( (response) => {
      return response.json()
    })
    .then( (dataJSON) => {
      let affichage = produitQte + " " + produitNom + ".s ajouté.e.s dans le frigo !";
      document.getElementById("produitAjoutValide").innerHTML = affichage;
      recharge();
      document.getElementById("animationCourse").className = "animCoupleN";
    })
    .catch( (error) => console.log(error))
}

/*Rechercher un produit dans le frigo */
let chercheProduit = document.getElementById("rechercher");
chercheProduit.addEventListener("submit", chercherProduit);

function chercherProduit(event){
  event.preventDefault();
  let urlRecherche = url + '?search=' + document.getElementById("produitRecherche").value;
  let fetchOptions = {method: 'GET'};
  fetch(urlRecherche, fetchOptions)
    .then( (response) => {
      return response.json()
    })
    .then( (dataJSON) => {
      let listeFinale = document.getElementById("produitExistant");
      let res ="";
      for (let p of dataJSON) {
        res = res + "<li> (" + p.qte + ") " + p.nom + "</li>";
      }
      if (res.length === 0) {
        res = "Aucun produit trouvé";
      }
      listeFinale.innerHTML = res;
    })
    .catch( (error) => {
      console.log(error)
    })
}

/*Affiche la liste pour sélectionner*/
afficherListe();
function afficherListe() {
  let fetchOptions = { method: 'GET' };
  fetch(url, fetchOptions)
    .then( (response) => {
      return response.json()
    })
    .then( (dataJSON) => {
      let resul =""
      for (let v of dataJSON) {
        resul = resul + "<option value=" + v.id + ">" + v.nom + "</option>";
      }
      document.getElementById("produitHabAjout").innerHTML = resul;
      document.getElementById("produitHabSupp").innerHTML = resul;
      document.getElementById("produitHabSuppTotal").innerHTML = resul;
    })
    .catch( (error) => {
      console.log(error)
    })
}

/*Ajoute 1 à un produit*/
let ajoutUn = document.getElementById("ajoutUnProduit");
ajoutUn.addEventListener("click", ajouterUnProduit);

/*Supprime 1 à un produit*/
let suppUn = document.getElementById("suppUnProduit");
suppUn.addEventListener("click", enleverUnProduit);

/*Modifie quantité d'un produit*/
let produitConcerne = new Object();
let val;
let produitId;
let sortie = 0;

function ajouterUnProduit(event) {
  val = "plus";
  produitId = document.getElementById("produitHabAjout").value;
  ajouterUnExistant();
}

function enleverUnProduit(event) {
  val = "moins";
  produitId = document.getElementById("produitHabSupp").value;
  ajouterUnExistant();
}

async function ajouterUnExistant(){
    let url2 = url + "/" + produitId;
    //récup infos du produit selctionné
    let fetchOptions1 = {method: 'GET'};
    await fetch(url2, fetchOptions1)
        .then( (response) => {
            return response.json()
        })
        .then( (dataJSON) => {
            produitConcerne.id =dataJSON.id;
            produitConcerne.nom =dataJSON.nom;
            produitConcerne.qte = dataJSON.qte;
        })
        .catch( (error) => {
            console.log(error)
        })

    let produitFinal = {
        id: produitConcerne.id,
        nom: produitConcerne.nom,
        qte: produitConcerne.qte
    };

    if (Object.is(val,"plus")) {
      produitFinal.qte = produitFinal.qte + 1;
    }

    if (Object.is(val,"moins")) {
      if (produitFinal.qte === 1) {
          sortie = 1;
          suppTotalProduit(url + "/" + produitFinal.id, sortie, produitFinal.nom);
      }
      produitFinal.qte = produitFinal.qte - 1;
    }

    const fetchOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify(produitFinal)
    };

    fetch(url, fetchOptions)
        .then( (response) => {
            return response.json()
        })
        .then( (dataJSON) => {
          if (Object.is(val,"plus")) {
            let affichage = "1 " + produitConcerne.nom + " ajouté.e dans le frigo !";
            document.getElementById("produitHabAjoutValide").innerHTML = affichage;
            document.getElementById("animationCourse").className = "animCoupleN";
          }
          if ((Object.is(val,"moins")) && (sortie === 0)) {
            let affichage = "1 " + produitConcerne.nom + " consommé.e ! Il en reste " + produitConcerne.qte + " !";
            document.getElementById("produitHabSuppValide").innerHTML = affichage;
            document.getElementById("animationMange").className = "animMangeN"
          }
          recharge();
        })
        .catch( (error) => console.log(error))
}

/*Supprime totalement un produit*/
let suppTotal = document.getElementById("suppUnProduitTotal");
suppTotal.addEventListener("click", initSuppTotalProduit);

function initSuppTotalProduit(event) {
  suppTotalProduit(url + "/" + document.getElementById("produitHabSuppTotal").value, 2, "");
}

function suppTotalProduit(urlS, aff, nomProduit){
    const fetchOptions = {
        method: 'DELETE',
    };

    fetch(urlS, fetchOptions)
        .then( (response) => {
            return response.json()
        })
        .then( (dataJSON) => {
          if (aff === 1) {
            document.getElementById("produitHabSuppValide").innerHTML = "Il n'en restait plus qu'un.e " + nomProduit + " !";
          }else {
            document.getElementById("produitHabSuppTotalValide").innerHTML = "Il n'y en a plus !";
          }
          document.getElementById("animationMange").className = "animMangeN"
          recharge();
        })
        .catch( (error) => console.log(error))
    }

/*Rechargement*/
function recharge() {
  afficherListe();
  if (ouveture === 1) {
      listerFrigo();
  }
}
