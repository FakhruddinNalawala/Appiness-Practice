var y=document.querySelectorAll("button");
document.addEventListener("DOMContentLoaded", function(event)   {
    // console.log(y);
});
// console.log(document.querySelectorAll("button"));

var n=document.getElementById("output");
var m=0.00;
var operand1=0.00;
var operand2=0.00;
var operator="";
var decimal=false;
var decCount=0;
var inUse=false;
console.log(decimal+" "+inUse);
var i=0;
var z=new Array();
var cont=true;
var pointPressed=false;
var zeroCounter=0;

y.forEach(element => {
    z.push(element.value);    
});
console.log(z)
function run(i)   {
    console.log(z);
    var a=z[i]
    console.log(a);
    switch(a)   {

        
        case "mrc": m=0;
                    break;

        case "m-":  m-=operand1;
                    break;

        case "m+":  m+=operand1;
                    break;

        case "m":   if(inUse)   {
                        operand2=m;
                    }   else    {
                        operand1=m;
                    }
                    n.value=m;
                    break;

        case "clr": if(operand2!=0) {
                        inUse=false;
                        operand2=0.00;
                        n.value=0.00;
                    }   else {
                        operand1=0.00;
                        n.value=0.00;
                        operator="";
                    }
                    break;

        case "sqrt":    operation(operand1,operand2,operator);
                        operand2=0.00;
                        operator="";
                        var ans=Math.sqrt(operand1);
                        operand1=ans;
                        n.value=ans;
                        break;

        case "inv": if(operand2==0) {
                        operand1=-operand1;
                        n.value=operand1;
                    }   else    {
                        operand2=-operand2;
                        n.value=operand2;
                    }
                    break;

        case "%":   if(inUse)   {
                        operand2/=100;
                        n.value=operand2;
                    }   else    {
                        operand1/=100;
                        n.value=operand1;
                    }
                    break;
            
        case "/":   operation(operand1,operand2,operator);
                    operand2=0.00;
                    operator="/";
                    cont=true;
                    break;

        case "7":   put(7);
                    break;
                    
        case "8":   put(8);
                    break;
                    
        case "9":   put(9);
                    break;

        case "*":   operation(operand1,operand2,operator);
                    operand2=0.00;
                    operator="*";
                    cont=true;
                    break;

        case "4":   put(4);
                    break;
                                    
        case "5":   put(5);
                    break;
                                    
        case "6":   put(6);
                    break;
            
        case "-":   operation(operand1,operand2,operator);
                    operand2=0.00;
                    operator="-";
                    cont=true;
                    break;

        case "1":   put(1);
                    break;
                                                
        case "2":   put(2);
                    break;
                                                
        case "3":   put(3);
                    break;
                        
        case "+":   operation(operand1,operand2,operator);
                    operand2=0.00;
                    operator="+";
                    cont=true;
                    break;

        case ".":   if  (decimal==false && pointPressed==false)   {
                        pointPressed=true;
                    }
                    break;

        case "0":   put(0);
                    break;

        case "00":  put(0);
                    put(0);
                    break;

        case "=":   operation(operand1,operand2,operator);
                    operator="";
                    inUse=false;
                    break;
            
        default:    break;
    }
    console.log(operand1+" "+operand2+" "+operator);
}

    function operation(opr1,opr2,opr) {
        decimal=false;
        console.log(opr1+" "+opr2+" "+opr);
        if(inUse)   {
            switch(opr) {
                case "/":   operand1 = operand1/operand2;
                            break;
                case "*":   operand1 = operand1*operand2;
                            break;
                case "-":   operand1 = operand1-operand2;
                            break;
                case "+":   operand1 = operand1+operand2;                
                            break;
                default:    operand1 = operand1;
            }
        }   else    {
            inUse=true;
        }
        n.value=operand1;
        operand2=0;
        cont=false;
        zeroCounter=0;
    }



    function put(num)   {
        console.log(operand1+" "+operand2+" "+operator);
        num=Number(num);
        if (cont==true) {
            if (pointPressed==true) {
                pointPressed=false;
                decimal=true;
                if(inUse==true) {
                    operand2=Number(operand2+"."+("0".repeat(zeroCounter))+num);
                    n.value=operand2;
                }   else if (inUse==false)  {
                    operand1=Number(operand1+"."+("0".repeat(zeroCounter))+num);
                    n.value=operand1;
                }
                if (num==0) {
                    zeroCounter++;
                    pointPressed=true;
                }   else if(zeroCounter>0)  {
                    zeroCounter=0;
                }
                
            }   else    {
                    if (decimal==true && inUse==true)  {
                    operand2=Number(operand2+("0".repeat(zeroCounter))+String(num)); 
                    n.value=operand2;
                    console.log(operand2);
                }   else if (decimal==true && inUse==false)  {
                    operand1=Number(operand1+("0".repeat(zeroCounter))+String(num));
                    n.value=operand1;
                    console.log(operand1);
                }   else if (decimal==false && inUse==true)  {
                    operand2=operand2*10+num;
                    n.value=operand2;
                    console.log(operand2);
                }   else    {
                    operand1=operand1*10+num;
                    n.value=operand1;
                    console.log(operand1);
                }
                if (num==0) {
                    zeroCounter++;
                }   else    {
                    zeroCounter=0;
                }
            }
        }
        else    {
            cont=true;
            operand1=Number(num);
            n.value=operand1;
        }
        console.log(operand1+" "+operand2+" "+operator);
    }
