import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth"
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, from, of } from 'rxjs';
import { switchMap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  signUp(credentials) {
   return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password)
    .then(res => {
      console.log("name");
      return this.db.doc(`users/${res.user.uid}`)
      .set({
        name: credentials.name,
        email: credentials.email,
        role: credentials.role,
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
    })
  }


  // from turns promise to Observable.
  signIn(credentials): Observable<any> {
    return from(this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password)).pipe(
      switchMap(user => {
        console.log("real user", user);
        
        if(!user) {
          return of(null);
        } else {
          // Toget values from the db use valueChanges
          return this.db.doc(`users/${user.user.uid}`).valueChanges()
        }
      })
    )
  }
}
