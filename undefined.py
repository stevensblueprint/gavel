# Created by: Breanna Tolocka
# I pledge my honor that I have abided by the stevens honor system

from cs115 import*

FullAdder ={ ('0','0','0') : ('0','0'),
('0','0','1') : ('1','0'),
('0','1','0') : ('1','0'),
('0','1','1') : ('0','1'),
('1','0','0') : ('1','0'),
('1','0','1') : ('0','1'),
('1','1','0') : ('0','1'),
('1','1','1') : ('1','1') }

def numToBaseB(N,B):
    '''This function takes in integer N and B and outputs a string of N converted to Base B'''
    if N==0:
        return ''
    return numToBaseB(N//B,B) + str(N%B)

def baseBToNum(S,B):
    '''Input string S and a base B where S represents a number in base B where B is between 2 and 10 and returns an integer in base 10 representing the same number as S'''
    if S=="":
        return 0
    return B*baseBToNum(S[:-1],B)+int(S[-1])

def baseToBase(B1,B2,SinB1):
    '''Returns a string representing SinB1 in Base2'''
    if B1=="" or B2=="":
        return ""
    return numToBaseB(baseBToNum(SinB1,B1),B2)

def add(S,T):
    '''Takes in two binary strings A and T and returns their sum'''
    return str(numToBaseB(baseBToNum(S,2)+baseBToNum(T,2),2))

def addB(S,T):
    '''Takes in two strings and finds the sums without converting'''
    def help(S,T,carry):
        if S=='' and T=='' and carry== '0':
            return''
        if S=='' and T=='' and carry== '1':
            return '1'
        elif S=='':
            sum=FullAdder[('0',T[-1],carry)]
        elif T=='':
            sum=FullAdder[(S[-1],'0',carry)]
        else:
            sum= FullAdder[(S[-1],T[-1],carry)]
        return help(S[:-1],T[:-1],sum[1])+sum[0]
    return help(S,T,'0')
            
            


    
