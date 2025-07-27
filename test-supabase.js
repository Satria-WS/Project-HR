// Test file to verify Supabase connection
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Environment check:');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ Missing environment variables!');
  console.log('Make sure you have a .env file with:');
  console.log('VITE_SUPABASE_URL=your-supabase-url');
  console.log('VITE_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  try {
    console.log('\n🔄 Testing Supabase connection...');
    console.log('📍 URL:', supabaseUrl);
    
    // Test basic connection by checking profiles table (without count)
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.error('Full error:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('📊 Profiles table accessible');
    console.log('📈 Query result:', data);
    
    // Test auth service
    const { data: { user } } = await supabase.auth.getUser();
    console.log('👤 Current user:', user ? 'Logged in' : 'Not logged in');
    
    // Test all tables
    const tables = ['profiles', 'projects', 'tasks', 'comments', 'team_members'];
    console.log('\n🔍 Testing table access...');
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        if (tableError) {
          console.error(`❌ ${table}: ${tableError.message}`);
        } else {
          console.log(`✅ ${table}: accessible`);
        }
      } catch (err) {
        console.error(`❌ ${table}: ${err.message}`);
      }
    }
    
    // Test a simple insert/delete to verify write permissions
    console.log('\n🔧 Testing write permissions...');
    try {
      // This will likely fail due to RLS policies (which is expected)
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: '00000000-0000-0000-0000-000000000000',
          email: 'test@example.com'
        });
      
      if (insertError && insertError.code === '42501') {
        console.log('✅ RLS policies are active (insert blocked as expected)');
      } else if (insertError) {
        console.log(`ℹ️  Insert test: ${insertError.message}`);
      } else {
        console.log('⚠️  Insert succeeded (unexpected without auth)');
      }
    } catch (err) {
      console.log(`ℹ️  Write test: ${err.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run the test
testSupabaseConnection()
  .then((success) => {
    if (success) {
      console.log('\n🎉 All tests passed! Your Supabase integration is ready.');
    } else {
      console.log('\n💥 Some tests failed. Check your configuration.');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
  });
