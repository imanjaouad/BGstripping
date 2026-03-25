from pymongo import MongoClient

client= MongoClient("mongodb://localhost:27017/")
db= client["gestion_produits"]
base= db["produits"]

def ajouter():
    produit={}
    numero = input("entrez votre numero :")
    nom_prod = input("entrez votre nom_prod :")
    prix = input("entrez votre prix_prod :")
    quantite = int(input("entrez votre quantite :"))

    produit["Numero"]=numero
    produit["Nom_prod"]=nom_prod
    produit["Prix_prod"]=prix
    produit["Quantite"]=quantite

    base.insert_one(produit)

print("produit ajoutée avec succès")


for i in range(3):
        print(f" Produit {i+1} :")
        ajouter()
def afficher():
        
        print("\n------------Liste des produits ----------------")
        for produit in base.find():
            print(produit)
        print("-------------------------------------------------")

afficher()

def supprimer():
      numero=input("entrez le numero")
      filter={"Numero":numero}
      choix=input("Veuillez taper la lettre s ou 0 pour supprimer le prodit")

      if (choix=="s" or choix=="0"):
            base.delete_one(filter)
            print("produit selectionné a été supprimé avec succès")

      else:
            pass
      
supprimer()
afficher()


numero=input("entrez le numero du produit a modifier ")
nouveau_prix=input(f"Veuillez entrez le nouveau prix pour le prodiuit numero {numero}")

def modifier():
      base.update_one(
            {"Numero",numero},
            {"$set":{"Nouveau_prix":nouveau_prix}}
            print(f"le produit numero {numero} a été supprimé avec succès")
      )

modifier()
afficher()
      









    


