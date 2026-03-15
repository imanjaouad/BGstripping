from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

db = client["gestion_employes"]

collection1=db["employes"]
collection2=db["departements"]


def ajouter_employes(n):
    employes =[]

    for i in range(n):
        print(f"employe ajouté {i+1}")
        employe = {
            "id_employe": int(input("id :")),
            "nom":input("nom :"),
            "prenom":input("specialite :"),
            "poste":input("poste :"),
            "salaire":int(input("salaire :")),
            "id_depart":int(input("id depart :"))
        }
        employes.append(employe)
    collection1.insert_many(employes)
    print("Formateurs ajoutées avec succès !")

def ajouter_departements(n):
    departements=[]

    for i in range(n):
        print(f"departements ajouté {i+1}")
        departement ={
            "id_depart":int(input("entrez id departement")),
            "nom_departement":input("entrez le nom du department"),
            "responsable":input("entrez le responsable")
        }

        departements.append(departement)
    collection2.insert_many(departement)
    print("departements ajoutés avec succès")


def supprimer_employe(id_employe):
    resultat = collection1.delete_one({"id_employe":id_employe})
    if resultat.deleted_count == 1:
        print("employe supprimé")
    else:
        print("employe introuvable")

def afficher_employe_par_departement(id_depart):
    departement = collection2.find({"id_depart":id_depart})

    print("employe dans le departement :")
    trouve = False
    for d in departement:
        print(f"id_depart:{d["id_depart"]}")
        print(f"id_depart:{d["id_depart"]}")
        print(f"nom responsable:{d["responsable"]}")
    if not trouve:
        print("aucun departements trouvé")


def modifier_salaire(id_employe):
    nouveaux_donnees = {
        "nom":input("entrez le nouveau nom"),
        "prenom":input("entrez nouveau prenom"),
        "poste":input("entrez le nouveau poste"),
        "salaire":input("entrez le nouveau salaire")
    }

    resultat = collection1.update_one(
        {"id_employe":id_employe},
        {"$set":nouveaux_donnees}
    )

    if resultat.matched.count == 1:
        print("employe modifié avec succès")
    else:
        print("employe introuvable")
    

def menu():
    while True:
        print("""
===== MENU =====
1. Ajouter des employes
2. Supprimer un employe
3. Modifier un employe
4. Afficher employes par departement
0. Quitter
""")

        choix = input("Votre choix : ")

        if choix == "1":
            n = int(input("Nombre de employes à ajouter : "))
            ajouter_employes(n)

        elif choix == "2":
            idf = input("ID du employe à supprimer : ")
            supprimer_employe(idf)

        elif choix == "3":
            idf = input("ID du employe à modifier : ")
            modifier_salaire(idf)

        elif choix == "4":
            id_depart = input("entrez le id de departement : ")
            afficher_employe_par_departement(id_depart)

        elif choix == "0":
            print("Au revoir")
            break

        else:
            print("Choix invalide.")


menu()
