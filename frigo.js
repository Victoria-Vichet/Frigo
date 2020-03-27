const url ="http://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigos/26/produits";

/* Lister le contenu du frigo */
let contenuFrigo = document.getElementById("contenu");
contenuFrigo.addEventListener("click", listerFrigo);

function listerFrigo(event){
  let fetchOptions = {method: 'GET'};
  fetch(url, fetchOptions)
    .then( (response) => {
      return response.json()
    })
    .then( (dataJSON) => {
      let listeFinale = document.getElementById("contenuFrigo");
      let res ="";
      for (let p of dataJSON) {
        res = res + "<li>" + p.nom + "</li>";
      }
      listeFinale.innerHTML = res;
    })
    .catch( (error) => {
      console.log(error)
    })
}

/* Ajouter un nouveau produit au frigo */
let ajoutProduit = document.getElementById("ajouter");
ajoutProduit.addEventListener("click", ajouterProduit);

function ajouterProduit(event){
  let produitNom = document.getElementById("produitAjout").value;
  let produitQte = document.getElementById("quantiteAjout").value;
  let produit = {"nom": produitNom, "qte":produitQte};
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const fetchOptions = {
   method: 'POST',
   headers: myHeaders,
   body: JSON.stringify(produit)
  }
  fetch(url, fetchOptions)
    .then( (response) => {
      if (true) {
        return response.json()
      }else{
        throw new Error('Le produit existe déjà');
      }
    })
    .then( (dataJSON) => {

    })
    .catch( (error) => console.log(error))
}

/*Rechercher un produit dans le frigo */
let chercheProduit = document.getElementById("rechercher");
chercheProduit.addEventListener("click", chercherProduit);

function chercherProduit(event){
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
        res = res + "<li>" + p.nom + "</li>";
      }
      listeFinale.innerHTML = res;
    })
    .catch( (error) => {
      console.log(error)
    })
}
