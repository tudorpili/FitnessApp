# Proiect Aplicatie Fitness (Frontend React)

## Descriere

Aceasta este o aplicatie web prototip Aplicatia simuleaza functionalitati pentru monitorizarea activitatilor de fitness, a nutritiei, vizualizarea retetelor si managementul planurilor de antrenament. Include si o sectiune de administrare pentru gestionarea utilizatorilor si exercitiilor. In stadiul actual, aplicatia foloseste date simulate (mock data) si stocare locala in browser (localStorage) pentru a demonstra functionalitatile fara a necesita un backend real.

## Functionalitati Implementate (Frontend)

Aplicatia include urmatoarele pagini si functionalitati simulate:

* **Autentificare / Inregistrare:** Interfete UI pentru login si register.
* **Roluri Utilizatori:** Simulare pentru trei tipuri de acces: Vizitator (Guest), Utilizator Logat (User), Administrator (Admin).
* **Navigare Protejata:** Rutare implementata cu `react-router-dom`, folosind componente `ProtectedRoute` pentru a restrictiona accesul pe baza rolului si a statusului de autentificare.
* **Layout-uri Diferite:**
    * `GuestLayout`: Un header simplu pentru paginile publice accesibile vizitatorilor.
    * `AppLayout`: Layout principal pentru utilizatorii logati, cu sidebar navigabil si meniu profil.
    * `AdminLayout`: Layout dedicat sectiunii de administrare, cu sidebar specific.
* **Pagini Publice (Guest & User Logat):**
    * **Exercitii Interactive:** Pagina cu un model SVG al corpului uman; click pe un muschi filtreaza lista de exercitii (date mock). Include vizualizare video exercitiu.
    * **Retete:** Afisare retete (date mock) sub forma de carduri; pagina de detalii pentru fiecare reteta; filtrare simpla dupa tag-uri; adaugare reteta noua (salvata in `localStorage`).
* **Pagini Utilizator Logat (User & Admin):**
    * **Dashboard:** Pagina principala dupa login, cu widget-uri (actiuni rapide, activitate recenta mock, grafice progres mock); personalizabil (adaugare/stergere widget-uri, salvat in `localStorage`).
    * **Inregistrare Antrenament:** Pagina pentru logarea unui antrenament; include timer, selectare data, adaugare exercitii (din lista mock) cu seturi multiple (reps, weight, unit), salvare log in state-ul sesiunii si afisare istoric sesiune.
    * **Monitorizare Greutate:** Inregistrare greutate pentru o anumita data, afisare istoric (mock + adaugari sesiune), grafic Chart.js pentru vizualizare trend (date mock).
    * **Monitorizare Calorii:** Pagina cu grafice Chart.js (linie pentru calorii, doughnut pentru macro) bazate pe date mock.
    * **Inregistrare Mese:** Pagina pentru logarea meselor (Mic Dejun, Pranz, Cina, Gustare); cautare alimente (mock), adaugare in jurnalul zilei (state sesiune), calcul totaluri zilnice (state sesiune), input cantitate (grame).
    * **Planuri Antrenament:** Vizualizare planuri mock; adaugare plan nou (nume, descriere, selectie exercitii - salvat in state sesiune).
    * **Calculatoare Fitness:** Pagina cu calculatoare pentru BMR/TDEE (Mifflin-St Jeor), 1RM Estimat (Brzycki), Macronutrienti (pe baza de TDEE si presetari raport). Include selectie unitati (Metric/Imperial) si persistenta input folosind `localStorage`.
    * **Setari:** Pagina placeholder pentru setari profil/aplicatie; include selectie unitate preferata (salvata local).
    * **Jurnal Activitate:** Pagina ce afiseaza un feed cronologic simulat (mock data) de activitati diverse (antrenamente, mese, greutate). Include filtrare simpla.
* **Pagini Admin (Doar Admin):**
    * **Management Utilizatori:** Afisare lista utilizatori mock intr-un tabel sortabil si filtrabil (search); adaugare, editare, stergere (cu confirmare), activare/dezactivare utilizatori (modifica doar state-ul local) folosind modale. Include validare pentru email/username duplicat la adaugare/editare.
    * **Management Exercitii:** Afisare lista exercitii mock intr-un tabel sortabil; adaugare, editare, stergere (cu confirmare) exercitii folosind modale; vizualizare video exercitiu intr-un modal.

## Tehnologii Folosite

* **Frontend:**
    * React
    * Vite 
    * Tailwind CSS 
    * React Router DOM 
    * React Icons 
    * Chart.js & react-chartjs-2 
* **Backend (Intentie / Neimplementat):**
    * Node.js
    * Express.js
    * MySQL (sau alta baza de date relationala)


## Rularea Aplicatiei

**Prerechizite:**

* Node.js (versiunea 18 sau mai recenta recomandata)
* npm (vine de obicei cu Node.js)

**Pasi:**

1.  **Clonare Repository:**
    ```bash
    git clone <URL_REPOSITORY>
    cd <NUME_FOLDER_PROIECT>/frontend
    ```
2.  **Instalare Dependente:**
    Navigheaza in folderul `frontend` (daca nu esti deja acolo) si ruleaza:
    ```bash
    npm install
    ```
3.  **Pornire Server Dezvoltare:**
    Ruleaza comanda:
    ```bash
    npm run dev
    ```
4.  **Accesare Aplicatie:**
    Deschide browser-ul web si navigheaza la adresa afisata in terminal (de obicei `http://localhost:5173` sau similar).

## Date Autentificare (Mock)

Pentru a testa diferitele roluri, foloseste urmatoarele date de autentificare pe pagina de Login:

* **Utilizator:**
    * Email: `user@app.com`
    * Parola: `password`
* **Administrator:**
    * Email: `admin@app.com`
    * Parola: `password`

## Status Curent si Limitari

* Aplicatia este un **prototip frontend**. Nu exista un backend functional conectat.
* Toate datele afisate initial sunt **simulate (mock data)** din fisiere locale (`src/mockData/`).
* Actiunile de **adaugare, editare sau stergere** (utilizatori, exercitii, retete, planuri, log-uri) modifica doar **starea locala a componentelor** sau folosesc `localStorage`. Datele **nu sunt persistente** intr-o baza de date reala si se pierd la inchiderea completa a browserului (pentru state) sau daca se curata `localStorage`.
* Functionalitatile legate de **notificari sau sincronizare cu dispozitive externe** nu sunt implementate si sunt doar pentru UI.

