import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://owmdhrvscnbiuvoihozb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93bWRocnZzY25iaXV2b2lob3piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNTc3NzAsImV4cCI6MjA2NzYzMzc3MH0.uff-HrH8DnOC8VGffBSYXzmV_Ur2JQWnHDM0woudSG4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
