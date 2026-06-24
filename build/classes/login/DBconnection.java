
package login;

import java.sql.*;


/**
 *
 * @author USER
 */
 public class DBconnection { 
  
    public final  Connection getcon(){
        
        
        
        try{
               Class.forName("com.mysql.jdbc.Driver");
              Connection con= DriverManager.getConnection("jdbc:mysql://localhost:3308/demo");
              return con;
        }
      
       catch(Exception ex){
              System.out.println("There were errors while connecting to db.");
             return null;
        
       }
        
    
    } }
    

