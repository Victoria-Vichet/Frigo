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

/*Affiche la liste pour sélectionner*/
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
  })
  .catch( (error) => {
    console.log(error)
  })

/*Ajoute 1 à un produit*/
let ajoutUn = document.getElementById("ajoutUnProduit");
ajoutUn.addEventListener("click", ajouterUnExistant);
let produitConcerne = new Object();

async function ajouterUnExistant(event){
    let produitNom = document.getElementById("produitHabAjout").value;
    let url2 = url + "/" + produitNom;

    //récup infos produit selctionne
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
    myHeaders.append("Content-Type", "application/json",);
    let produitFinal = {
        id: produitConcerne.id,
        nom: produitConcerne.nom,
        qte: produitConcerne.qte + 1
    };

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
            let affichage = "1 " + produitConcerne.nom + " ajouté.e dans le frigo !";
            document.getElementById("produitHabAjoutValide").innerHTML = affichage;
        })
        .catch( (error) => console.log(error))
}
