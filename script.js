
products=[];
var quantityActive=false;
var table= document.querySelector('#table');
var summaryTable= document.querySelector('#summary-table');
var totalAmount=0;

var addCart=document.querySelectorAll('.cart-button');
for(let but of addCart){
    but.onclick=function(){
       var name= but.previousElementSibling.innerHTML;
        var parent=but.parentElement;
        var price= parent.children[1].children[1].innerHTML;
        var quantity=1;
       var product={
           name:name,
           price:price,
           quantity:quantity
       }
       products.push(product);
       clearTable();
       insertItems();

       
       but.style.display="none";
       but.nextElementSibling.style.display="block";
    }
}
var removeCart=document.querySelectorAll('.remove-cart');
for(let but of removeCart){
    but.onclick=function(){
        but.style.display="none";
        var previous=but.previousElementSibling;
        previous.style.display="block";
        var name=previous.previousElementSibling.innerHTML;
        products.forEach(function(value,index) {  
            if (value.name==name){
                deleteItem(index)
            }
        });
    }
}

var insertItems = function(){
    products.forEach(function(value,index) {  
        updateTable(index, value.name, value.price);

    });
    amount();
    document.querySelector('.number').innerHTML=products.length; 
}
var updateTable=function(index, name, price){
    
    var tr= table.insertRow(-1);
    var cell1=tr.insertCell(0);
    var cell2= tr.insertCell(1);
    var cell3=tr.insertCell(2);
    var cell4= tr.insertCell(3);
    var cell5= tr.insertCell(4);

    cell1.innerHTML=index+1;
    cell2.innerHTML=name;
     cell3.innerHTML=price;
    cell4.innerHTML= `<div class="quantity">
    <button class='minus'>-</button>
    <p class='number'>1</p>
    <button class='add'>+</button>
    </div>`;
    cell5.innerHTML="<button class='remove'>Remove</button>";
    activateButtons();
}
var clearTable= function(){
    var rowCount = table.rows.length;
            for (var i= rowCount-1; i>0; i--){
                table.deleteRow(i);
            }
}

var updateQuantity = function(row, quantity){
    var parentRow = row.parentElement.parentElement.parentElement;
    var index= parentRow.rowIndex;
    products[index-1].quantity=quantity;

    
}

var activateButtons= function(){
    var buttons= document.querySelectorAll('.minus');
    for(let but of buttons){
        but.onclick=function (){
            if(this.nextElementSibling.innerHTML==1){
                    alert('You cant have less than one quantity. You can choose to remove item');
            }
            else{
            this.nextElementSibling.innerHTML--;
            var quantity = this.nextElementSibling.innerHTML;
            updateQuantity(this, quantity);
            amount();
            }
        }
    }
    var buttons2= document.querySelectorAll('.add');
    for(let but of buttons2){
        but.onclick=function (){
            this.previousElementSibling.innerHTML++;
            var quantity = this.previousElementSibling.innerHTML;
           updateQuantity(this, quantity);
            amount();
        }
    }
    var removeB= document.querySelectorAll('.remove');
        for(let but of removeB){
            but.onclick=function (){
              var  deletedItem = this.parentNode.parentNode.rowIndex-1;
           //table.deleteRow(deletedItem);
                deleteItem(deletedItem);
          var name=this.parentNode.parentElement.children[1].innerHTML;
          for(let but of addCart){
             if (name== but.previousElementSibling.innerHTML){
                 but.style.display="block";
                 but.nextElementSibling.style.display="none";
             }

            }

        }
    }   
}
var amount = function(){
    var row=document.querySelectorAll('tr');
    var rowCount = table.rows.length;
    var total=0
            for (var i= rowCount-1; i>0; i--){
                var price= row[i].childNodes[2].innerHTML;
                price = price.slice(1);
                price = price.replace(',', '');
                var quantity= row[i].childNodes[3].childNodes[0].children[1].innerHTML;
                var amount= price*quantity;
             total=total+amount;   
            }
           // console.log(total);
            document.querySelector('.cash').innerHTML=total;
            totalAmount=total;
}
var deleteItem= function(item){
                products.splice(item, 1);
                clearTable();
                insertItems();
}
var cart= document.querySelector('.cart');
cart.onclick=function(){
    document.querySelector('.form').style.display="block";
    document.getElementsByTagName('main')[0].classList.add('modal');
}
var cont= document.querySelector('.continue');
cont.onclick=function(){
    document.querySelector('.form').style.display="none";
}
var checkout= document.querySelector('#checkout');
checkout.onclick=function(){
    console.log(totalAmount);
    if (totalAmount<=0){
        alert("Hello!! Your cart is empty. Add item to cart befor checking out!!");
        return false;
    }
   else if(validEmail()){
    payWithPaystack();
    document.querySelector('.form').style.display="none";
    }
    return false;
}
function validEmail(){
    var email = document.querySelector('#email-address').value;
    if (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email))
  {
    return true;
  }
    else{
    alert("You have entered an invalid email address!");
    return false;
    }
    return false;
}

var insertSummaryItems = function(){
    products.forEach(function(value,index) {  
        updateSummaryTable(index, value.name, value.quantity);
    });
    document.querySelector('#getName').innerHTML= document.querySelector('#name').value;
}
var removeCart= document.querySelectorAll('.remove-cart');
var close= document.querySelector('.summary-btn');
close.onclick=function(){
    document.querySelector('.summary').style.display="none";
    clearTable();
    products=[];
    for(let but of removeCart){
            but.style.display="none";
            but.previousElementSibling.style.display="block";
       }
            totalAmount=0;
    document.querySelector('.cash').innerHTML=totalAmount;
    document.querySelector('.number').innerHTML=products.length;
    //clear summary table
    var rowCount = summaryTable.rows.length;
    for (var i= rowCount-1; i>0; i--){
        table.deleteRow(i);
    }
}
function updateSummaryTable(index, name, quantity){
    var tr= summaryTable.insertRow(-1);
    var cell1=tr.insertCell(0);
    var cell2= tr.insertCell(1);
    var cell3=tr.insertCell(2);
    

    cell1.innerHTML=index+1;
    cell2.innerHTML=name;
     cell3.innerHTML=quantity;
}

function payWithPaystack() {
   // e.preventDefault();
    let handler = PaystackPop.setup({
      key: 'pk_test_5386c957f3981a75aa9494a3df7f3885fa81ce63', // Replace with your public key
      email: document.getElementById("email-address").value,
      amount: totalAmount* 100,
      ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      // label: "Optional string that replaces customer email"
      onClose: function(){
        alert('Window closed.');
      },
      callback: function(response){
        let message = 'Payment complete! Reference: ' + response.reference;
        alert(message);
        insertSummaryItems();
        document.querySelector('.summary').style.display="block";
      }
    });
    handler.openIframe();
  }