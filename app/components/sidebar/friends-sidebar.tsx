
'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWalletStore } from '@/wallet/state';
import { MessageSigner } from '@/components/crypto/message-signer';
import { Search, Plus, MessageSquare } from 'lucide-react';

// Mock friends data
const mockFriends = [
  { id: '1', name: 'Alice', address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', avatar: '/images/avatars/alice.png', status: 'online' },
  { id: '2', name: 'Bob', address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', avatar: '/images/avatars/bob.png', status: 'offline' },
  { id: '3', name: 'Charlie', address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y', avatar: '/images/avatars/charlie.png', status: 'online' },
];

export function FriendsSidebar() {
  const { walletConnected } = useWalletStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMessageSigner, setShowMessageSigner] = useState(true);

  const filteredFriends = mockFriends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!walletConnected) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Friends</CardTitle>
          <CardDescription>
            Connect your wallet to see your friends
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      {showMessageSigner && <MessageSigner />}
      
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Friends</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Your contacts and friends
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-white/5 border-white/10 text-white"
            />
          </div>
          
          <div className="space-y-2">
            {filteredFriends.length > 0 ? (
              filteredFriends.map(friend => (
                <div key={friend.id} className="flex items-center justify-between p-2 rounded-md hover:bg-white/5 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback className="bg-blue-500/20 text-blue-300">
                          {friend.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{friend.name}</p>
                      <p className="text-xs text-gray-400">{`${friend.address.substring(0, 6)}...${friend.address.substring(friend.address.length - 4)}`}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-400 py-4">No friends found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
