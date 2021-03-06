import { User,Message } from './login/types/types';
import { Observable, BehaviorSubject, from } from 'rxjs';

export class AppService {

  private users: User[] = [];
  private currentUser: User = null;
  private messages: Message[] = [];
  private subject = null;
  private subjectMessages = null;

  constructor() {
    const usersParsed = JSON.parse(localStorage.getItem('users'));
    this.users = usersParsed ? usersParsed : [];
    
    const currentUserParsed = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser = currentUserParsed ? currentUserParsed : null;
    this.subject = new BehaviorSubject<User>(this.currentUser); 

    const messagesParsed = JSON.parse(localStorage.getItem('messages'));
    this.messages = messagesParsed ? messagesParsed : [];
    this.subjectMessages = new BehaviorSubject<Message[]>(this.messages);
  }
  
  public sendCurrUser(currUserName: string): void {
    this.subject.next({ name: currUserName });
  }

  public getUserAsObservable(): Observable<User> {
    return this.subject.asObservable(); 
  }

  public getMessageasAsObservable(): Observable<Message[]> {
    return this.subjectMessages.asObservable(); 
  }

  public addUser(newUser: User){
    if (!newUser.name) return;
    var foundUser = this.users.find(elem => elem.name == newUser.name);
    if (!foundUser) {
        this.users.push(newUser);
        this.currentUser = newUser;
    }
    else {
        this.currentUser = foundUser;
    }
    this.saveUsers();
  }

  saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.users));
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  addMessage(newMessage: Message){
    if (newMessage.text.search(/\S/)==-1) return;
    else{
      this.messages.push(newMessage);
      this.saveMessages();
      this.subjectMessages.next(this.messages);
    } 
  }

  saveMessages() {
    localStorage.setItem('messages', JSON.stringify(this.messages));
  }

  editMessage(pos: number,newMessage: Message){
    if (newMessage.text==""){
      this.delMessage(pos);
    }
    else this.messages.splice(pos,1,newMessage);
    this.saveMessages();
    this.subjectMessages.next(this.messages);
  }

  delMessage(i: number){
    this.messages = this.messages.filter((mess,index) => index!=i);
    this.saveMessages();
    this.subjectMessages.next(this.messages);
  }
}