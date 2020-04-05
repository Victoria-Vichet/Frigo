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
  console.log(fetchOptions);
  fetch(url, fetchOptions)
    .then( (response) => {
      return response.json()
    })
    .then( (dataJSON) => {
      let affichage = produitQte + " " + produitNom + ".s ajouté.e.s dans le frigo !";
      document.getElementById("produitAjoutValide").innerHTML = affichage;
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
/* Ici */
/*Affiche la liste pour sélectionner puis ajouter 1 à ce produit */
let afficheContenu = document.getElementById("produitHabAjout");
afficheContenu.addEventListener("mouseover", listerProduits);

function listerProduits(event){
  let fetchOptions = { method: 'GET' };
  fetch(url, fetchOptions)
    .then( (response) => {
      return response.json()
    })
    .then( (dataJSON) => {
      let listeFinal = document.getElementById("produitHabAjout");
      let resul =""
      for (let v of dataJSON) {
        resul = resul + "<option value=" + v.id + ">" + v.nom + "</option>";
      }
      listeFinal.innerHTML = resul;
    })
    .catch( (error) => {
      console.log(error)
    })
}

let ajoutUn = document.getElementById("ajoutUnProduit");
ajoutUn.addEventListener("click", ajouterUnExistant);
let produitConcerne = new Object();

async function ajouterUnExistant(event){
    let produitNom = document.getElementById("produitHabAjout").value;
    console.log(produitNom);
    let url2 = url + "/" + produitNom;
    console.log(url2);
    //récup infos produit
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

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let produitFinal = {"nom": produitConcerne.nom,"qte":produitConcerne.qte + 1};

    console.log(produitFinal);

    const fetchOptions = {
     method: 'PUT',
     headers: myHeaders,
     body: JSON.stringify(produitFinal)
    }
    fetch(url2, fetchOptions)
      .then( (response) => {
        return response.json();
      })
      .then( (dataJSON) => {
        let affichage = "1 " + dataJSON.nom + " ajouté.e dans le frigo !";
        console.log(dataJSON.nom);
        document.getElementById("produitHabAjoutValide").innerHTML = affichage;
      })
      .catch( (error) => console.log(error))
/* jusque là */
}
